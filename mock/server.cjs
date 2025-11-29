const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json())

// 读取 JSON 数据文件
const shopsDataPath = path.join(__dirname, 'data', 'shop.json')
const productsDataPath = path.join(__dirname, 'data', 'products.json')

// GET 接口：获取所有商家信息
app.get('/api/shops', (req, res) => {
  try {
    const shopsData = JSON.parse(fs.readFileSync(shopsDataPath, 'utf8'))
    res.json({
      code: 200,
      data: shopsData,
      message: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    })
  }
})

// POST 接口：通过商家 id 获取对应的团购商品
app.post('/api/deals', (req, res) => {
  try {
    const { restaurantId } = req.body
    
    if (!restaurantId) {
      return res.status(400).json({
        code: 400,
        data: null,
        message: 'restaurantId 参数不能为空'
      })
    }

    const productsData = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'))
    
    // 根据商家 id 返回对应的团购商品（这里简化处理，所有商品都属于商家 id 为 '1' 的商家）
    const deals = productsData.filter(product => {
      // 如果后续需要支持多个商家，可以在这里添加 restaurantId 字段到 products.json
      // 目前所有商品都属于商家 id 为 '1' 的商家
      return restaurantId === '1'
    })

    res.json({
      code: 200,
      data: deals,
      message: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    })
  }
})

app.listen(4000, '0.0.0.0', () => {
  console.log('Mock API 运行在 http://localhost:4000')
  console.log('局域网访问: http://192.168.0.100:4000')
})