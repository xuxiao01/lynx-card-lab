// 测试代理联通性的简单脚本
const http = require('http');

console.log('🧪 开始测试代理配置...\n');

// 测试1: 直接访问后端服务器
console.log('测试1: 直接访问后端 http://localhost:4000/api/shops');
http.get('http://localhost:4000/api/shops', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ 后端服务器正常工作!');
    console.log('   状态码:', res.statusCode);
    console.log('   响应:', JSON.parse(data));
    console.log('\n-----------------\n');
    
    // 测试2: 通过前端代理访问
    console.log('测试2: 通过前端代理访问 http://localhost:3001/api/shops');
    testProxy();
  });
}).on('error', err => {
  console.log('❌ 后端服务器未运行!');
  console.log('   错误:', err.message);
  console.log('\n请先运行: node mock/server.cjs');
});

function testProxy() {
  http.get('http://localhost:3001/api/shops', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ 代理配置成功! 前端可以访问后端!');
      console.log('   状态码:', res.statusCode);
      console.log('   响应:', JSON.parse(data));
      console.log('\n🎉 测试通过! 代理联通正常!');
    });
  }).on('error', err => {
    console.log('❌ 代理访问失败!');
    console.log('   错误:', err.message);
    console.log('\n可能原因:');
    console.log('1. 前端开发服务器未运行 (运行: npm run dev)');
    console.log('2. 代理配置有误');
    console.log('3. 端口不匹配');
  });
}

