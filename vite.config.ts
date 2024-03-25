import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// 参考：https://cn.vitejs.dev/config/
export default defineConfig({
	base: './',
	resolve: {
		// 配置别名
		alias: {
			'@': resolve(__dirname, './src'),
			'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
		}
	},
	plugins: [
		vue(),
		vueSetupExtend(),
		createSvgIconsPlugin({
			iconDirs: [resolve(__dirname, 'src/icons/svg')],
			symbolId: 'icon-[dir]-[name]'
		})
	],
	server: {
		host: '0.0.0.0',
		port: 3000, // 端口号
		open: false, // 是否自动打开浏览器
		proxy: {
			'/api': {
				target: 'https://demo.maku.net/maku-cloud-server',
				ws: false,//代理websocked
				changeOrigin: true,  //是否跨域
				// secure: true,  //是否https接口
				bypass(req, res, options) {
					const proxyURL = options.target + options.rewrite(req.url)
					req.headers['x-req-proxyURL'] = proxyURL // 设置未生效
					req.headers['Referer']='https://demo.maku.net/'// 设置响应头可以看到
					res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
				},
				rewrite: path => path.replace(RegExp(`^/api`), '')
			}
		}
	}
})
