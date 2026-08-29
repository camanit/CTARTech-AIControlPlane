// Package agentguard provides the official Go SDK and Gin Web Middleware
// for CTARTech-AIControlPlane Runtime Authority Gateway.
package agentguard

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

// Client handles AI Agent Authority policy evaluations
type Client struct {
	BaseURL    string
	APIKey     string
	FailSafe   bool
	HTTPClient *http.Client
}

// EvaluateActionRequest matches AIControlPlane evaluation payload
type EvaluateActionRequest struct {
	AgentID         string                 `json:"agent_id"`
	Action          string                 `json:"action"`
	TargetSystem    string                 `json:"target_system"`
	Context         map[string]interface{} `json:"context"`
	ActingForUserID string                 `json:"acting_for_user_id,omitempty"`
	SessionID       string                 `json:"session_id,omitempty"`
}

// EvaluateActionResponse returns runtime authority decisions
type EvaluateActionResponse struct {
	Decision   string `json:"decision"` // ALLOW, REQUIRE_APPROVAL, BLOCK
	AuditID    string `json:"audit_id"`
	ApprovalID string `json:"approval_id,omitempty"`
	Reason     string `json:"reason"`
}

// NewClient initializes a new Agent Guard SDK instance
func NewClient(baseURL, apiKey string) *Client {
	return &Client{
		BaseURL:  strings.TrimRight(baseURL, "/"),
		APIKey:   apiKey,
		FailSafe: true,
		HTTPClient: &http.Client{
			Timeout: 3 * time.Second,
		},
	}
}

// EvaluateAction evaluates an agent action against the Runtime Control Plane
func (c *Client) EvaluateAction(req EvaluateActionRequest) (*EvaluateActionResponse, error) {
	endpoint := fmt.Sprintf("%s/api/v1/guard/evaluate", c.BaseURL)

	payloadBytes, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.APIKey))

	res, err := c.HTTPClient.Do(httpReq)
	if err != nil {
		if c.FailSafe {
			return &EvaluateActionResponse{
				Decision: "BLOCK",
				AuditID:  fmt.Sprintf("fail_safe_%d", time.Now().Unix()),
				Reason:   fmt.Sprintf("[Fail-Safe] Control plane gateway offline: %v", err),
			}, nil
		}
		return nil, err
	}
	defer res.Body.Close()

	var evalRes EvaluateActionResponse
	if err := json.NewDecoder(res.Body).Decode(&evalRes); err != nil {
		return nil, err
	}

	return &evalRes, nil
}

// QuickVerify returns true if the action is allowed, false if held or blocked
func (c *Client) QuickVerify(agentID, action, targetSystem string, context map[string]interface{}) bool {
	req := EvaluateActionRequest{
		AgentID:      agentID,
		Action:       action,
		TargetSystem: targetSystem,
		Context:      context,
	}
	res, err := c.EvaluateAction(req)
	if err != nil {
		return false
	}
	return res.Decision == "ALLOW"
}

// StandardHTTPMiddleware wraps standard http.Handler with AI Agent runtime authority verification
func (c *Client) StandardHTTPMiddleware(action, targetSystem string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		agentID := r.Header.Get("X-Agent-ID")
		if agentID == "" {
			agentID = "anonymous_agent"
		}

		eval, err := c.EvaluateAction(EvaluateActionRequest{
			AgentID:      agentID,
			Action:       action,
			TargetSystem: targetSystem,
			Context: map[string]interface{}{
				"method": r.Method,
				"path":   r.URL.Path,
			},
		})

		if err != nil || eval.Decision != "ALLOW" {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprintf(w, `{"error":"Action intercepted","decision":"%s","reason":"%s"}`, eval.Decision, eval.Reason)
			return
		}

		next.ServeHTTP(w, r)
	})
}
