import { defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
	// Get repository name from environment for GitHub Pages
	const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'grid-life';
	
	return {
		root: './',
		// Set base path for GitHub Pages deployment
		base: mode === 'production' && process.env.GITHUB_PAGES 
			? `/${repoName}/` 
			: '/',
		server: {
			port: 3000,
			open: true,
			host: true
		},
		build: {
			outDir: 'dist',
			sourcemap: true,
			minify: 'esbuild',
			target: 'es2020'
		},
		resolve: {
			alias: {
				'@': './src'
			}
		},
		esbuild: {
			target: 'es2020'
		}
	};
}); 