import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { catalogManifest, catalogSkills, resolveCatalogSkillRef } from "./index.js";

const EXPECTED_BUNDLED_KEYS = [
  "paperclipai/bundled/docs/doc-maintenance",
  "paperclipai/bundled/paperclip-operations/issue-triage",
  "paperclipai/bundled/paperclip-operations/reflection-coach",
  "paperclipai/bundled/paperclip-operations/status-card-query",
  "paperclipai/bundled/paperclip-operations/summarize-status",
  "paperclipai/bundled/paperclip-operations/task-planning",
  "paperclipai/bundled/product/paperclip-capsules",
  "paperclipai/bundled/product/wireframe",
  "paperclipai/bundled/quality/qa-acceptance",
  "paperclipai/bundled/software-development/github-pr-workflow",
];

const EXPECTED_OPTIONAL_KEYS = [
  "paperclipai/optional/browser/agent-browser",
  "paperclipai/optional/content/release-announcement",
  "paperclipai/optional/content/simplified-english",
  "paperclipai/optional/ecc-agents/a11y-architect",
  "paperclipai/optional/ecc-agents/agent-evaluator",
  "paperclipai/optional/ecc-agents/architect",
  "paperclipai/optional/ecc-agents/build-error-resolver",
  "paperclipai/optional/ecc-agents/chief-of-staff",
  "paperclipai/optional/ecc-agents/code-architect",
  "paperclipai/optional/ecc-agents/code-explorer",
  "paperclipai/optional/ecc-agents/code-reviewer",
  "paperclipai/optional/ecc-agents/code-simplifier",
  "paperclipai/optional/ecc-agents/comment-analyzer",
  "paperclipai/optional/ecc-agents/conversation-analyzer",
  "paperclipai/optional/ecc-agents/cpp-build-resolver",
  "paperclipai/optional/ecc-agents/cpp-reviewer",
  "paperclipai/optional/ecc-agents/csharp-reviewer",
  "paperclipai/optional/ecc-agents/dart-build-resolver",
  "paperclipai/optional/ecc-agents/database-reviewer",
  "paperclipai/optional/ecc-agents/django-build-resolver",
  "paperclipai/optional/ecc-agents/django-reviewer",
  "paperclipai/optional/ecc-agents/doc-updater",
  "paperclipai/optional/ecc-agents/docs-lookup",
  "paperclipai/optional/ecc-agents/e2e-runner",
  "paperclipai/optional/ecc-agents/fastapi-reviewer",
  "paperclipai/optional/ecc-agents/flutter-reviewer",
  "paperclipai/optional/ecc-agents/fsharp-reviewer",
  "paperclipai/optional/ecc-agents/gan-evaluator",
  "paperclipai/optional/ecc-agents/gan-generator",
  "paperclipai/optional/ecc-agents/gan-planner",
  "paperclipai/optional/ecc-agents/go-build-resolver",
  "paperclipai/optional/ecc-agents/go-reviewer",
  "paperclipai/optional/ecc-agents/harmonyos-app-resolver",
  "paperclipai/optional/ecc-agents/harness-optimizer",
  "paperclipai/optional/ecc-agents/healthcare-reviewer",
  "paperclipai/optional/ecc-agents/homelab-architect",
  "paperclipai/optional/ecc-agents/java-build-resolver",
  "paperclipai/optional/ecc-agents/java-reviewer",
  "paperclipai/optional/ecc-agents/kotlin-build-resolver",
  "paperclipai/optional/ecc-agents/kotlin-reviewer",
  "paperclipai/optional/ecc-agents/loop-operator",
  "paperclipai/optional/ecc-agents/marketing-agent",
  "paperclipai/optional/ecc-agents/mle-reviewer",
  "paperclipai/optional/ecc-agents/network-architect",
  "paperclipai/optional/ecc-agents/network-config-reviewer",
  "paperclipai/optional/ecc-agents/network-troubleshooter",
  "paperclipai/optional/ecc-agents/opensource-forker",
  "paperclipai/optional/ecc-agents/opensource-packager",
  "paperclipai/optional/ecc-agents/opensource-sanitizer",
  "paperclipai/optional/ecc-agents/performance-optimizer",
  "paperclipai/optional/ecc-agents/php-reviewer",
  "paperclipai/optional/ecc-agents/planner",
  "paperclipai/optional/ecc-agents/pr-test-analyzer",
  "paperclipai/optional/ecc-agents/python-reviewer",
  "paperclipai/optional/ecc-agents/pytorch-build-resolver",
  "paperclipai/optional/ecc-agents/rag-pipeline-reviewer",
  "paperclipai/optional/ecc-agents/react-build-resolver",
  "paperclipai/optional/ecc-agents/react-reviewer",
  "paperclipai/optional/ecc-agents/refactor-cleaner",
  "paperclipai/optional/ecc-agents/rust-build-resolver",
  "paperclipai/optional/ecc-agents/rust-reviewer",
  "paperclipai/optional/ecc-agents/security-reviewer",
  "paperclipai/optional/ecc-agents/seo-specialist",
  "paperclipai/optional/ecc-agents/silent-failure-hunter",
  "paperclipai/optional/ecc-agents/spec-miner",
  "paperclipai/optional/ecc-agents/swift-build-resolver",
  "paperclipai/optional/ecc-agents/swift-reviewer",
  "paperclipai/optional/ecc-agents/tdd-guide",
  "paperclipai/optional/ecc-agents/type-design-analyzer",
  "paperclipai/optional/ecc-agents/typescript-reviewer",
  "paperclipai/optional/ecc-agents/vue-reviewer",
  "paperclipai/optional/ecc-commands/cmd-aside",
  "paperclipai/optional/ecc-commands/cmd-auto-update",
  "paperclipai/optional/ecc-commands/cmd-build-fix",
  "paperclipai/optional/ecc-commands/cmd-checkpoint",
  "paperclipai/optional/ecc-commands/cmd-code-review",
  "paperclipai/optional/ecc-commands/cmd-cost-report",
  "paperclipai/optional/ecc-commands/cmd-cpp-build",
  "paperclipai/optional/ecc-commands/cmd-cpp-review",
  "paperclipai/optional/ecc-commands/cmd-cpp-test",
  "paperclipai/optional/ecc-commands/cmd-ecc-guide",
  "paperclipai/optional/ecc-commands/cmd-epic-claim",
  "paperclipai/optional/ecc-commands/cmd-epic-decompose",
  "paperclipai/optional/ecc-commands/cmd-epic-publish",
  "paperclipai/optional/ecc-commands/cmd-epic-review",
  "paperclipai/optional/ecc-commands/cmd-epic-sync",
  "paperclipai/optional/ecc-commands/cmd-epic-unblock",
  "paperclipai/optional/ecc-commands/cmd-epic-validate",
  "paperclipai/optional/ecc-commands/cmd-evolve",
  "paperclipai/optional/ecc-commands/cmd-fastapi-review",
  "paperclipai/optional/ecc-commands/cmd-feature-dev",
  "paperclipai/optional/ecc-commands/cmd-flutter-build",
  "paperclipai/optional/ecc-commands/cmd-flutter-review",
  "paperclipai/optional/ecc-commands/cmd-flutter-test",
  "paperclipai/optional/ecc-commands/cmd-gan-build",
  "paperclipai/optional/ecc-commands/cmd-gan-design",
  "paperclipai/optional/ecc-commands/cmd-go-build",
  "paperclipai/optional/ecc-commands/cmd-go-review",
  "paperclipai/optional/ecc-commands/cmd-go-test",
  "paperclipai/optional/ecc-commands/cmd-gradle-build",
  "paperclipai/optional/ecc-commands/cmd-harness-audit",
  "paperclipai/optional/ecc-commands/cmd-hookify",
  "paperclipai/optional/ecc-commands/cmd-hookify-configure",
  "paperclipai/optional/ecc-commands/cmd-hookify-help",
  "paperclipai/optional/ecc-commands/cmd-hookify-list",
  "paperclipai/optional/ecc-commands/cmd-instinct-export",
  "paperclipai/optional/ecc-commands/cmd-instinct-import",
  "paperclipai/optional/ecc-commands/cmd-instinct-status",
  "paperclipai/optional/ecc-commands/cmd-jira",
  "paperclipai/optional/ecc-commands/cmd-kotlin-build",
  "paperclipai/optional/ecc-commands/cmd-kotlin-review",
  "paperclipai/optional/ecc-commands/cmd-kotlin-test",
  "paperclipai/optional/ecc-commands/cmd-learn",
  "paperclipai/optional/ecc-commands/cmd-learn-eval",
  "paperclipai/optional/ecc-commands/cmd-loop-start",
  "paperclipai/optional/ecc-commands/cmd-loop-status",
  "paperclipai/optional/ecc-commands/cmd-marketing-campaign",
  "paperclipai/optional/ecc-commands/cmd-model-route",
  "paperclipai/optional/ecc-commands/cmd-multi-backend",
  "paperclipai/optional/ecc-commands/cmd-multi-execute",
  "paperclipai/optional/ecc-commands/cmd-multi-frontend",
  "paperclipai/optional/ecc-commands/cmd-multi-plan",
  "paperclipai/optional/ecc-commands/cmd-multi-workflow",
  "paperclipai/optional/ecc-commands/cmd-orch-add-feature",
  "paperclipai/optional/ecc-commands/cmd-orch-build-mvp",
  "paperclipai/optional/ecc-commands/cmd-orch-change-feature",
  "paperclipai/optional/ecc-commands/cmd-orch-fix-defect",
  "paperclipai/optional/ecc-commands/cmd-orch-refine-code",
  "paperclipai/optional/ecc-commands/cmd-orch-review",
  "paperclipai/optional/ecc-commands/cmd-plan",
  "paperclipai/optional/ecc-commands/cmd-plan-canvas",
  "paperclipai/optional/ecc-commands/cmd-plan-prd",
  "paperclipai/optional/ecc-commands/cmd-pm2",
  "paperclipai/optional/ecc-commands/cmd-pr",
  "paperclipai/optional/ecc-commands/cmd-project-init",
  "paperclipai/optional/ecc-commands/cmd-projects",
  "paperclipai/optional/ecc-commands/cmd-promote",
  "paperclipai/optional/ecc-commands/cmd-prp-commit",
  "paperclipai/optional/ecc-commands/cmd-prp-implement",
  "paperclipai/optional/ecc-commands/cmd-prp-plan",
  "paperclipai/optional/ecc-commands/cmd-prp-pr",
  "paperclipai/optional/ecc-commands/cmd-prp-prd",
  "paperclipai/optional/ecc-commands/cmd-prune",
  "paperclipai/optional/ecc-commands/cmd-python-review",
  "paperclipai/optional/ecc-commands/cmd-quality-gate",
  "paperclipai/optional/ecc-commands/cmd-react-build",
  "paperclipai/optional/ecc-commands/cmd-react-review",
  "paperclipai/optional/ecc-commands/cmd-react-test",
  "paperclipai/optional/ecc-commands/cmd-refactor-clean",
  "paperclipai/optional/ecc-commands/cmd-resume-session",
  "paperclipai/optional/ecc-commands/cmd-review-pr",
  "paperclipai/optional/ecc-commands/cmd-rust-build",
  "paperclipai/optional/ecc-commands/cmd-rust-review",
  "paperclipai/optional/ecc-commands/cmd-rust-test",
  "paperclipai/optional/ecc-commands/cmd-santa-loop",
  "paperclipai/optional/ecc-commands/cmd-save-session",
  "paperclipai/optional/ecc-commands/cmd-security-scan",
  "paperclipai/optional/ecc-commands/cmd-sessions",
  "paperclipai/optional/ecc-commands/cmd-setup-pm",
  "paperclipai/optional/ecc-commands/cmd-skill-create",
  "paperclipai/optional/ecc-commands/cmd-skill-health",
  "paperclipai/optional/ecc-commands/cmd-test-coverage",
  "paperclipai/optional/ecc-commands/cmd-update-codemaps",
  "paperclipai/optional/ecc-commands/cmd-update-docs",
  "paperclipai/optional/ecc-commands/cmd-vue-review",
  "paperclipai/optional/ecc-rules/angular",
  "paperclipai/optional/ecc-rules/arkts",
  "paperclipai/optional/ecc-rules/common",
  "paperclipai/optional/ecc-rules/cpp",
  "paperclipai/optional/ecc-rules/csharp",
  "paperclipai/optional/ecc-rules/dart",
  "paperclipai/optional/ecc-rules/fsharp",
  "paperclipai/optional/ecc-rules/golang",
  "paperclipai/optional/ecc-rules/java",
  "paperclipai/optional/ecc-rules/kotlin",
  "paperclipai/optional/ecc-rules/nuxt",
  "paperclipai/optional/ecc-rules/perl",
  "paperclipai/optional/ecc-rules/php",
  "paperclipai/optional/ecc-rules/python",
  "paperclipai/optional/ecc-rules/react",
  "paperclipai/optional/ecc-rules/react-native",
  "paperclipai/optional/ecc-rules/ruby",
  "paperclipai/optional/ecc-rules/rust",
  "paperclipai/optional/ecc-rules/swift",
  "paperclipai/optional/ecc-rules/typescript",
  "paperclipai/optional/ecc-rules/vue",
  "paperclipai/optional/ecc-rules/web",
  "paperclipai/optional/ecc/accessibility",
  "paperclipai/optional/ecc/agent-architecture-audit",
  "paperclipai/optional/ecc/agent-eval",
  "paperclipai/optional/ecc/agent-harness-construction",
  "paperclipai/optional/ecc/agent-introspection-debugging",
  "paperclipai/optional/ecc/agent-payment-x402",
  "paperclipai/optional/ecc/agent-self-evaluation",
  "paperclipai/optional/ecc/agent-sort",
  "paperclipai/optional/ecc/agentic-engineering",
  "paperclipai/optional/ecc/agentic-os",
  "paperclipai/optional/ecc/ai-first-engineering",
  "paperclipai/optional/ecc/ai-regression-testing",
  "paperclipai/optional/ecc/android-clean-architecture",
  "paperclipai/optional/ecc/angular-developer",
  "paperclipai/optional/ecc/api-connector-builder",
  "paperclipai/optional/ecc/api-design",
  "paperclipai/optional/ecc/architecture-decision-records",
  "paperclipai/optional/ecc/article-writing",
  "paperclipai/optional/ecc/automation-audit-ops",
  "paperclipai/optional/ecc/autonomous-agent-harness",
  "paperclipai/optional/ecc/autonomous-loops",
  "paperclipai/optional/ecc/backend-patterns",
  "paperclipai/optional/ecc/benchmark",
  "paperclipai/optional/ecc/benchmark-methodology",
  "paperclipai/optional/ecc/benchmark-optimization-loop",
  "paperclipai/optional/ecc/blender-motion-state-inspection",
  "paperclipai/optional/ecc/blueprint",
  "paperclipai/optional/ecc/brand-discovery",
  "paperclipai/optional/ecc/brand-voice",
  "paperclipai/optional/ecc/browser-qa",
  "paperclipai/optional/ecc/bun-runtime",
  "paperclipai/optional/ecc/canary-watch",
  "paperclipai/optional/ecc/carrier-relationship-management",
  "paperclipai/optional/ecc/cisco-ios-patterns",
  "paperclipai/optional/ecc/ck",
  "paperclipai/optional/ecc/claude-devfleet",
  "paperclipai/optional/ecc/click-path-audit",
  "paperclipai/optional/ecc/clickhouse-io",
  "paperclipai/optional/ecc/code-tour",
  "paperclipai/optional/ecc/codebase-onboarding",
  "paperclipai/optional/ecc/codehealth-mcp",
  "paperclipai/optional/ecc/coding-standards",
  "paperclipai/optional/ecc/competitive-platform-analysis",
  "paperclipai/optional/ecc/competitive-report-structure",
  "paperclipai/optional/ecc/compose-multiplatform-patterns",
  "paperclipai/optional/ecc/config-gc",
  "paperclipai/optional/ecc/configure-ecc",
  "paperclipai/optional/ecc/connections-optimizer",
  "paperclipai/optional/ecc/content-engine",
  "paperclipai/optional/ecc/content-hash-cache-pattern",
  "paperclipai/optional/ecc/context-budget",
  "paperclipai/optional/ecc/continuous-agent-loop",
  "paperclipai/optional/ecc/continuous-learning",
  "paperclipai/optional/ecc/continuous-learning-v2",
  "paperclipai/optional/ecc/contract-first",
  "paperclipai/optional/ecc/cost-aware-llm-pipeline",
  "paperclipai/optional/ecc/cost-tracking",
  "paperclipai/optional/ecc/council",
  "paperclipai/optional/ecc/council-multi-model",
  "paperclipai/optional/ecc/cpp-coding-standards",
  "paperclipai/optional/ecc/cpp-testing",
  "paperclipai/optional/ecc/crosspost",
  "paperclipai/optional/ecc/csharp-testing",
  "paperclipai/optional/ecc/customer-billing-ops",
  "paperclipai/optional/ecc/customs-trade-compliance",
  "paperclipai/optional/ecc/dart-flutter-patterns",
  "paperclipai/optional/ecc/dashboard-builder",
  "paperclipai/optional/ecc/data-scraper-agent",
  "paperclipai/optional/ecc/data-throughput-accelerator",
  "paperclipai/optional/ecc/database-migrations",
  "paperclipai/optional/ecc/deep-research",
  "paperclipai/optional/ecc/defi-amm-security",
  "paperclipai/optional/ecc/delivery-gate",
  "paperclipai/optional/ecc/deployment-patterns",
  "paperclipai/optional/ecc/design-system",
  "paperclipai/optional/ecc/dev-team",
  "paperclipai/optional/ecc/django-celery",
  "paperclipai/optional/ecc/django-patterns",
  "paperclipai/optional/ecc/django-security",
  "paperclipai/optional/ecc/django-tdd",
  "paperclipai/optional/ecc/django-verification",
  "paperclipai/optional/ecc/dmux-workflows",
  "paperclipai/optional/ecc/docker-patterns",
  "paperclipai/optional/ecc/documentation-lookup",
  "paperclipai/optional/ecc/dotnet-patterns",
  "paperclipai/optional/ecc/dynamic-workflow-mode",
  "paperclipai/optional/ecc/e2e-testing",
  "paperclipai/optional/ecc/ecc-guide",
  "paperclipai/optional/ecc/ecc-recipes",
  "paperclipai/optional/ecc/ecc-tools-cost-audit",
  "paperclipai/optional/ecc/email-ops",
  "paperclipai/optional/ecc/energy-procurement",
  "paperclipai/optional/ecc/enterprise-agent-ops",
  "paperclipai/optional/ecc/error-handling",
  "paperclipai/optional/ecc/eval-harness",
  "paperclipai/optional/ecc/evm-token-decimals",
  "paperclipai/optional/ecc/exa-search",
  "paperclipai/optional/ecc/fal-ai-media",
  "paperclipai/optional/ecc/fastapi-patterns",
  "paperclipai/optional/ecc/finance-billing-ops",
  "paperclipai/optional/ecc/flox-environments",
  "paperclipai/optional/ecc/flutter-dart-code-review",
  "paperclipai/optional/ecc/foundation-models-on-device",
  "paperclipai/optional/ecc/frontend-a11y",
  "paperclipai/optional/ecc/frontend-design-direction",
  "paperclipai/optional/ecc/frontend-patterns",
  "paperclipai/optional/ecc/frontend-slides",
  "paperclipai/optional/ecc/fsharp-testing",
  "paperclipai/optional/ecc/gan-style-harness",
  "paperclipai/optional/ecc/gateguard",
  "paperclipai/optional/ecc/generating-python-installer",
  "paperclipai/optional/ecc/git-workflow",
  "paperclipai/optional/ecc/github-ops",
  "paperclipai/optional/ecc/golang-patterns",
  "paperclipai/optional/ecc/golang-testing",
  "paperclipai/optional/ecc/google-workspace-ops",
  "paperclipai/optional/ecc/growth-log",
  "paperclipai/optional/ecc/healthcare-cdss-patterns",
  "paperclipai/optional/ecc/healthcare-emr-patterns",
  "paperclipai/optional/ecc/healthcare-eval-harness",
  "paperclipai/optional/ecc/healthcare-phi-compliance",
  "paperclipai/optional/ecc/hermes-imports",
  "paperclipai/optional/ecc/hexagonal-architecture",
  "paperclipai/optional/ecc/hipaa-compliance",
  "paperclipai/optional/ecc/homelab-network-readiness",
  "paperclipai/optional/ecc/homelab-network-setup",
  "paperclipai/optional/ecc/homelab-pihole-dns",
  "paperclipai/optional/ecc/homelab-vlan-segmentation",
  "paperclipai/optional/ecc/homelab-wireguard-vpn",
  "paperclipai/optional/ecc/hookify-rules",
  "paperclipai/optional/ecc/inherit-legacy-style",
  "paperclipai/optional/ecc/intent-driven-development",
  "paperclipai/optional/ecc/inventory-demand-planning",
  "paperclipai/optional/ecc/investor-materials",
  "paperclipai/optional/ecc/investor-outreach",
  "paperclipai/optional/ecc/ios-icon-gen",
  "paperclipai/optional/ecc/iterative-retrieval",
  "paperclipai/optional/ecc/ito-baskets",
  "paperclipai/optional/ecc/ito-compute",
  "paperclipai/optional/ecc/ito-inference",
  "paperclipai/optional/ecc/ito-training",
  "paperclipai/optional/ecc/java-coding-standards",
  "paperclipai/optional/ecc/jira-integration",
  "paperclipai/optional/ecc/jpa-patterns",
  "paperclipai/optional/ecc/knowledge-ops",
  "paperclipai/optional/ecc/kotlin-coroutines-flows",
  "paperclipai/optional/ecc/kotlin-exposed-patterns",
  "paperclipai/optional/ecc/kotlin-ktor-patterns",
  "paperclipai/optional/ecc/kotlin-patterns",
  "paperclipai/optional/ecc/kotlin-testing",
  "paperclipai/optional/ecc/kubernetes-patterns",
  "paperclipai/optional/ecc/laravel-patterns",
  "paperclipai/optional/ecc/laravel-plugin-discovery",
  "paperclipai/optional/ecc/laravel-security",
  "paperclipai/optional/ecc/laravel-tdd",
  "paperclipai/optional/ecc/laravel-verification",
  "paperclipai/optional/ecc/latency-critical-systems",
  "paperclipai/optional/ecc/lead-intelligence",
  "paperclipai/optional/ecc/liquid-glass-design",
  "paperclipai/optional/ecc/living-docs-governance",
  "paperclipai/optional/ecc/llm-trading-agent-security",
  "paperclipai/optional/ecc/logistics-exception-management",
  "paperclipai/optional/ecc/loop-design-check",
  "paperclipai/optional/ecc/mailtrap-email-integration",
  "paperclipai/optional/ecc/make-interfaces-feel-better",
  "paperclipai/optional/ecc/manim-video",
  "paperclipai/optional/ecc/market-research",
  "paperclipai/optional/ecc/marketing-campaign",
  "paperclipai/optional/ecc/mcp-server-patterns",
  "paperclipai/optional/ecc/messages-ops",
  "paperclipai/optional/ecc/ml-adoption-playbook",
  "paperclipai/optional/ecc/mle-workflow",
  "paperclipai/optional/ecc/motion-advanced",
  "paperclipai/optional/ecc/motion-foundations",
  "paperclipai/optional/ecc/motion-patterns",
  "paperclipai/optional/ecc/motion-ui",
  "paperclipai/optional/ecc/mysql-patterns",
  "paperclipai/optional/ecc/nanoclaw-repl",
  "paperclipai/optional/ecc/nasiko-control-plane",
  "paperclipai/optional/ecc/nestjs-patterns",
  "paperclipai/optional/ecc/netmiko-ssh-automation",
  "paperclipai/optional/ecc/network-bgp-diagnostics",
  "paperclipai/optional/ecc/network-config-validation",
  "paperclipai/optional/ecc/network-interface-health",
  "paperclipai/optional/ecc/nextjs-turbopack",
  "paperclipai/optional/ecc/nodejs-keccak256",
  "paperclipai/optional/ecc/nutrient-document-processing",
  "paperclipai/optional/ecc/nuxt4-patterns",
  "paperclipai/optional/ecc/openclaw-persona-forge",
  "paperclipai/optional/ecc/opensource-pipeline",
  "paperclipai/optional/ecc/orch-add-feature",
  "paperclipai/optional/ecc/orch-build-mvp",
  "paperclipai/optional/ecc/orch-change-feature",
  "paperclipai/optional/ecc/orch-fix-defect",
  "paperclipai/optional/ecc/orch-pipeline",
  "paperclipai/optional/ecc/orch-refine-code",
  "paperclipai/optional/ecc/parallel-execution-optimizer",
  "paperclipai/optional/ecc/perl-patterns",
  "paperclipai/optional/ecc/perl-security",
  "paperclipai/optional/ecc/perl-testing",
  "paperclipai/optional/ecc/plan-canvas",
  "paperclipai/optional/ecc/plan-orchestrate",
  "paperclipai/optional/ecc/plankton-code-quality",
  "paperclipai/optional/ecc/postgres-patterns",
  "paperclipai/optional/ecc/prediction-market-oracle-research",
  "paperclipai/optional/ecc/prediction-market-risk-review",
  "paperclipai/optional/ecc/prisma-patterns",
  "paperclipai/optional/ecc/product-capability",
  "paperclipai/optional/ecc/product-lens",
  "paperclipai/optional/ecc/production-audit",
  "paperclipai/optional/ecc/production-scheduling",
  "paperclipai/optional/ecc/project-flow-ops",
  "paperclipai/optional/ecc/prompt-optimizer",
  "paperclipai/optional/ecc/python-patterns",
  "paperclipai/optional/ecc/python-testing",
  "paperclipai/optional/ecc/pytorch-patterns",
  "paperclipai/optional/ecc/quality-nonconformance",
  "paperclipai/optional/ecc/quarkus-patterns",
  "paperclipai/optional/ecc/quarkus-security",
  "paperclipai/optional/ecc/quarkus-tdd",
  "paperclipai/optional/ecc/quarkus-verification",
  "paperclipai/optional/ecc/ralphinho-rfc-pipeline",
  "paperclipai/optional/ecc/react-native-patterns",
  "paperclipai/optional/ecc/react-patterns",
  "paperclipai/optional/ecc/react-performance",
  "paperclipai/optional/ecc/react-testing",
  "paperclipai/optional/ecc/recsys-pipeline-architect",
  "paperclipai/optional/ecc/recursive-decision-ledger",
  "paperclipai/optional/ecc/redis-patterns",
  "paperclipai/optional/ecc/regex-vs-llm-structured-text",
  "paperclipai/optional/ecc/remotion-video-creation",
  "paperclipai/optional/ecc/repo-scan",
  "paperclipai/optional/ecc/research-ops",
  "paperclipai/optional/ecc/returns-reverse-logistics",
  "paperclipai/optional/ecc/rules-distill",
  "paperclipai/optional/ecc/rust-patterns",
  "paperclipai/optional/ecc/rust-testing",
  "paperclipai/optional/ecc/safety-guard",
  "paperclipai/optional/ecc/santa-method",
  "paperclipai/optional/ecc/scientific-db-pubmed-database",
  "paperclipai/optional/ecc/scientific-db-uspto-database",
  "paperclipai/optional/ecc/scientific-pkg-gget",
  "paperclipai/optional/ecc/scientific-thinking-literature-review",
  "paperclipai/optional/ecc/scientific-thinking-scholar-evaluation",
  "paperclipai/optional/ecc/search-first",
  "paperclipai/optional/ecc/security-bounty-hunter",
  "paperclipai/optional/ecc/security-review",
  "paperclipai/optional/ecc/security-scan",
  "paperclipai/optional/ecc/seo",
  "paperclipai/optional/ecc/skill-comply",
  "paperclipai/optional/ecc/skill-scout",
  "paperclipai/optional/ecc/skill-stocktake",
  "paperclipai/optional/ecc/social-graph-ranker",
  "paperclipai/optional/ecc/social-publisher",
  "paperclipai/optional/ecc/springboot-patterns",
  "paperclipai/optional/ecc/springboot-security",
  "paperclipai/optional/ecc/springboot-tdd",
  "paperclipai/optional/ecc/springboot-verification",
  "paperclipai/optional/ecc/strategic-compact",
  "paperclipai/optional/ecc/swift-actor-persistence",
  "paperclipai/optional/ecc/swift-concurrency-6-2",
  "paperclipai/optional/ecc/swift-protocol-di-testing",
  "paperclipai/optional/ecc/swiftui-patterns",
  "paperclipai/optional/ecc/taste",
  "paperclipai/optional/ecc/tasteforge-video",
  "paperclipai/optional/ecc/tdd-workflow",
  "paperclipai/optional/ecc/team-agent-orchestration",
  "paperclipai/optional/ecc/team-builder",
  "paperclipai/optional/ecc/terminal-opener",
  "paperclipai/optional/ecc/terminal-ops",
  "paperclipai/optional/ecc/tinystruct-patterns",
  "paperclipai/optional/ecc/token-budget-advisor",
  "paperclipai/optional/ecc/ui-demo",
  "paperclipai/optional/ecc/ui-to-vue",
  "paperclipai/optional/ecc/uncloud",
  "paperclipai/optional/ecc/unified-memory",
  "paperclipai/optional/ecc/unified-notifications-ops",
  "paperclipai/optional/ecc/verification-loop",
  "paperclipai/optional/ecc/video-editing",
  "paperclipai/optional/ecc/videodb",
  "paperclipai/optional/ecc/visa-doc-translate",
  "paperclipai/optional/ecc/vite-patterns",
  "paperclipai/optional/ecc/vue-patterns",
  "paperclipai/optional/ecc/windows-desktop-e2e",
  "paperclipai/optional/ecc/workspace-surface-audit",
  "paperclipai/optional/ecc/x-api",
  "paperclipai/optional/finance/ramp",
  "paperclipai/optional/product/design-critique",
  "paperclipai/optional/research/last30days",
  "paperclipai/optional/software-development/prepare-mcp-integration",
];

const MAX_FRONTMATTER_DESCRIPTION_LENGTH = 300;
const REPO_ROOT = path.resolve(fileURLToPath(new URL("../../..", import.meta.url)));
const SKILL_FRONTMATTER_ROOTS = [
  path.join(REPO_ROOT, ".agents"),
  path.join(REPO_ROOT, "skills"),
  path.join(REPO_ROOT, "packages/adapters"),
  path.join(REPO_ROOT, "packages/plugins"),
  path.join(REPO_ROOT, "packages/skills-catalog/catalog"),
  path.join(REPO_ROOT, "packages/teams-catalog/catalog"),
];

function listSkillFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSkillFiles(entryPath);
    if (entry.isFile() && entry.name === "SKILL.md") return [entryPath];
    return [];
  });
}

function readFrontmatterDescription(markdown: string): string | null {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const lines = match[1]!.split(/\r?\n/);
  const descriptionIndex = lines.findIndex((line) => line.startsWith("description:"));
  if (descriptionIndex === -1) return null;

  const inlineValue = lines[descriptionIndex]!.slice("description:".length).trim();
  if (/^[>|][+-]?$/.test(inlineValue)) {
    const descriptionLines: string[] = [];
    for (let index = descriptionIndex + 1; index < lines.length; index += 1) {
      const line = lines[index]!;
      if (/^[A-Za-z0-9_-]+:/.test(line)) break;
      descriptionLines.push(line.trim());
    }
    return descriptionLines.join(" ").replace(/\s+/g, " ").trim();
  }

  return inlineValue.replace(/^['"]|['"]$/g, "");
}

describe("shipped skills catalog", () => {
  it("ships the summarize-status streaming protocol", () => {
    const skill = readFileSync(
      path.join(
        REPO_ROOT,
        "packages/skills-catalog/catalog/bundled/paperclip-operations/summarize-status/SKILL.md",
      ),
      "utf8",
    );

    expect(skill).toContain("Post the first status update immediately, before doing anything else.");
    expect(skill).toContain('STATUS: considering "Fix login redirect loop"…');
    expect(skill).toContain("<<<SUMMARY-DRAFT>>>");
    expect(skill).toContain("<<<END-SUMMARY-DRAFT>>>");
    expect(skill).toContain("tool-call arguments don't stream; assistant text does");
    expect(skill).toContain("falls back to its spinner");
    expect(skill).toContain("Open with what the reader needs to do.");
    expect(skill).toContain("1–3 specific, concrete, actionable items");
  });

  it("keeps repo and catalog skill descriptions within the prompt budget cap", () => {
    const violations: string[] = [];
    for (const skillFile of SKILL_FRONTMATTER_ROOTS.flatMap(listSkillFiles)) {
      const description = readFrontmatterDescription(readFileSync(skillFile, "utf8"));
      if (!description) {
        violations.push(`${path.relative(REPO_ROOT, skillFile)} is missing a frontmatter description`);
      } else if (description.length > MAX_FRONTMATTER_DESCRIPTION_LENGTH) {
        violations.push(`${path.relative(REPO_ROOT, skillFile)} description is ${description.length} chars`);
      }
    }
    for (const skill of catalogSkills) {
      if (skill.description.length > MAX_FRONTMATTER_DESCRIPTION_LENGTH) {
        violations.push(`${skill.key} generated description is ${skill.description.length} chars`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("ships the expected bundled and optional skill set", () => {
    const bundledKeys = catalogSkills
      .filter((skill) => skill.kind === "bundled")
      .map((skill) => skill.key)
      .sort();
    const optionalKeys = catalogSkills
      .filter((skill) => skill.kind === "optional")
      .map((skill) => skill.key)
      .sort();

    expect(bundledKeys).toEqual(EXPECTED_BUNDLED_KEYS);
    expect(optionalKeys).toEqual(EXPECTED_OPTIONAL_KEYS);
  });

  it("keeps script-bearing shipped skills explicit so install stays audit-gated", () => {
    // The real install-time security boundary audits materialized bytes and blocks
    // hard-stop findings. Static assets (svg/html templates, e.g. the wireframe skill)
    // carry the "assets" trust level and are installable.
    const scriptBearing = catalogSkills.filter((skill) => skill.trustLevel === "scripts_executables");
    expect(scriptBearing.map((skill) => skill.key)).toEqual([
  "paperclipai/optional/ecc/agent-self-evaluation",
  "paperclipai/optional/ecc/continuous-learning-v2",
  "paperclipai/optional/ecc/council-multi-model",
  "paperclipai/optional/ecc/frontend-slides",
  "paperclipai/optional/ecc/ios-icon-gen",
  "paperclipai/optional/ecc/ito-baskets",
  "paperclipai/optional/ecc/rules-distill",
  "paperclipai/optional/ecc/skill-comply",
  "paperclipai/optional/ecc/skill-stocktake",
  "paperclipai/optional/ecc/terminal-opener",
  "paperclipai/optional/ecc/videodb",
  "paperclipai/optional/research/last30days",
    ]);
  });

  it("populates browse/search-relevant fields for every shipped skill", () => {
    const issues: string[] = [];
    for (const skill of catalogSkills) {
      if (skill.compatibility !== "compatible") {
        issues.push(`${skill.key} compatibility=${skill.compatibility}`);
      }
      if (!skill.description || skill.description.length < 40) {
        issues.push(`${skill.key} description must be at least 40 characters for catalog browse/search`);
      }
      if (skill.recommendedForRoles.length === 0) {
        issues.push(`${skill.key} must list recommendedForRoles`);
      }
      if (skill.tags.length === 0) {
        issues.push(`${skill.key} must list tags`);
      }
    }
    expect(issues).toEqual([]);
  });

  it("uses canonical paperclipai keys derived from kind/category/slug", () => {
    const violations: string[] = [];
    for (const skill of catalogSkills) {
      const expectedKey = `paperclipai/${skill.kind}/${skill.category}/${skill.slug}`;
      const expectedId = `paperclipai:${skill.kind}:${skill.category}:${skill.slug}`;
      if (skill.key !== expectedKey) violations.push(`${skill.key} should be ${expectedKey}`);
      if (skill.id !== expectedId) violations.push(`${skill.id} should be ${expectedId}`);
    }
    expect(violations).toEqual([]);
  });

  it("exposes a stable manifest header for downstream consumers", () => {
    expect(catalogManifest.schemaVersion).toBe(1);
    expect(catalogManifest.packageName).toBe("@paperclipai/skills-catalog");
    expect(catalogSkills.length).toBe(EXPECTED_BUNDLED_KEYS.length + EXPECTED_OPTIONAL_KEYS.length);
  });

  it("resolves shipped skills by id, key, and unique slug", () => {
    const sample = catalogSkills.find((skill) => skill.key === "paperclipai/bundled/software-development/github-pr-workflow");
    expect(sample, "expected github-pr-workflow to ship in the bundled catalog").toBeDefined();
    if (!sample) return;

    expect(resolveCatalogSkillRef(sample.id)).toMatchObject({ key: sample.key });
    expect(resolveCatalogSkillRef(sample.key)).toMatchObject({ key: sample.key });
    expect(resolveCatalogSkillRef(sample.slug)).toMatchObject({ key: sample.key });
  });

  it("keeps the Ramp wrapper fail-closed on mixed-provenance playbooks", () => {
    const rampSkill = readFileSync(new URL("../catalog/optional/finance/ramp/SKILL.md", import.meta.url), "utf8");

    expect(rampSkill).toContain("mixes Official and Community playbooks");
    expect(rampSkill).toContain("do not execute them inside Paperclip unless a Paperclip approval explicitly names the playbook");
    expect(rampSkill).toContain("third-party browser automation, MCP server, CLI, or connector");
  });

  it("keeps the Ramp wrapper clear of remote-fetch execution hard-stop patterns", () => {
    const rampSkill = readFileSync(new URL("../catalog/optional/finance/ramp/SKILL.md", import.meta.url), "utf8");
    const remoteExecPattern = /\b(?:curl|wget)\b[\s\S]{0,160}\|\s*(?:sh|bash)|\b(?:bash|sh)\s+-c\b|\beval\b|\bpython\s+-c\b|\bnode\s+-e\b/i;

    expect(remoteExecPattern.test(rampSkill)).toBe(false);
  });
});
