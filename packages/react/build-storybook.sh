#!/bin/sh
cd ../tokens
npm install
node build.mjs
cd ../react
cp ../tokens/dist/brand-a/default/tokens.css .storybook/tokens.css
cp ../tokens/dist/brand-b/default/tokens.css .storybook/tokens-brand-b.css
cp ../tokens/dist/brand-a/compact/tokens.css .storybook/tokens-brand-a-compact.css
cp ../tokens/dist/brand-b/compact/tokens.css .storybook/tokens-brand-b-compact.css
npm install
npx storybook build
