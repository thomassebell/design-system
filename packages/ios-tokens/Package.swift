// swift-tools-version: 5.9
// ──────────────────────────────────────────────
// DSTokens — Auto-generated design tokens for iOS / SwiftUI.
// Consume the generated output/DesignTokens.swift file.
// ──────────────────────────────────────────────

import PackageDescription

let package = Package(
    name: "DSTokens",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "DSTokens",
            targets: ["DSTokens"]
        )
    ],
    targets: [
        .target(
            name: "DSTokens",
            path: "output",
            sources: ["DesignTokens.swift"]
        )
    ]
)
