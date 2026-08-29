from setuptools import setup, find_packages

setup(
    name="itcowboy-guard",
    version="1.0.0",
    author="CTARTech / IT Cowboy",
    description="Python Client SDK for CTARTech-AIControlPlane Runtime Security Gateway",
    long_description=open("README.md", "r", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    packages=find_packages(),
    install_requires=[
        "httpx>=0.27.0",
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: GNU Affero General Public License v3 (AGPLv3)",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
)
