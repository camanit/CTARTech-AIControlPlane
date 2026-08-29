/**
 * @ctartech/ai-controlplane-middleware
 * Zero Trust Runtime Authority Middleware for Node.js, Express & LangChain AI Agents
 */

export interface AgentGuardConfig {
  controlPlaneUrl: string; // e.g. "http://localhost:8000"
  apiKey?: string;
  failSafe?: boolean; // Default true: blocks action if gateway unreachable
}

export interface AgentActionEvaluation {
  decision: 'ALLOW' | 'REQUIRE_APPROVAL' | 'BLOCK';
  audit_id: string;
  approval_id?: string;
  reason: string;
}

export class AgentGuardClient {
  private baseUrl: string;
  private apiKey: string;
  private failSafe: boolean;

  constructor(config: AgentGuardConfig) {
    this.baseUrl = config.controlPlaneUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey || 'itcg_live_key';
    this.failSafe = config.failSafe ?? true;
  }

  async evaluateAction(params: {
    agentId: string;
    action: string;
    targetSystem: string;
    context: Record<string, any>;
    actingForUserId?: string;
    sessionId?: string;
  }): Promise<AgentActionEvaluation> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/guard/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          agent_id: params.agentId,
          action: params.action,
          target_system: params.targetSystem,
          context: params.context,
          acting_for_user_id: params.actingForUserId,
          session_id: params.sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error(`AIControlPlane API error status: ${res.status}`);
      }

      return (await res.json()) as AgentActionEvaluation;
    } catch (err: any) {
      if (this.failSafe) {
        return {
          decision: 'BLOCK',
          audit_id: `fail_safe_${Date.now()}`,
          reason: `[Fail-Safe Intercept] Gateway tidak dapat dijangkau: ${err.message}`,
        };
      }
      throw err;
    }
  }

  /**
   * Express.js AI Agent Authority Guard Middleware
   * Usage: app.post('/api/execute-trade', agentGuard.expressMiddleware({ action: 'execute_trade', targetSystem: 'Financial_Core' }))
   */
  expressMiddleware(options: { action: string; targetSystem: string }) {
    return async (req: any, res: any, next: any) => {
      const agentId = req.headers['x-agent-id'] || 'anonymous_agent';
      const actingUserId = req.headers['x-user-id'] || 'system';
      const context = req.body || {};

      try {
        const evaluation = await this.evaluateAction({
          agentId,
          action: options.action,
          targetSystem: options.targetSystem,
          context,
          actingForUserId: actingUserId,
        });

        if (evaluation.decision === 'ALLOW') {
          req.guardAudit = evaluation;
          return next();
        }

        if (evaluation.decision === 'REQUIRE_APPROVAL') {
          return res.status(202).json({
            status: 'HELD_FOR_APPROVAL',
            approval_id: evaluation.approval_id,
            message: 'Aksi agen ditahan dan membutuhkan persetujuan CISO / Admin.',
            reason: evaluation.reason,
          });
        }

        return res.status(403).json({
          status: 'BLOCKED',
          audit_id: evaluation.audit_id,
          error: 'Aksi agen diblokir oleh AI Control Plane Runtime Guard.',
          reason: evaluation.reason,
        });
      } catch (err: any) {
        return res.status(503).json({
          status: 'SECURITY_GATEWAY_DOWN',
          error: 'Gagal mengevaluasi wewenang aksi agen.',
        });
      }
    };
  }

  /**
   * LangChain / AutoGen Tool Guard Decorator
   * Wrap any AI tool function with automatic authority evaluation
   */
  wrapTool(toolName: string, targetSystem: string, fn: (args: any) => Promise<any>) {
    return async (args: any, metadata?: { agentId?: string; userId?: string }) => {
      const agentId = metadata?.agentId || 'langchain_autonomous_agent';
      const evaluation = await this.evaluateAction({
        agentId,
        action: toolName,
        targetSystem,
        context: args,
        actingForUserId: metadata?.userId,
      });

      if (evaluation.decision !== 'ALLOW') {
        throw new Error(
          `[AgentGuard] Action '${toolName}' intercepted with decision: ${evaluation.decision}. Reason: ${evaluation.reason}`
        );
      }

      return await fn(args);
    };
  }
}
