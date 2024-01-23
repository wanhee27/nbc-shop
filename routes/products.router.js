import express from 'express';
import Products from '../schemas/products.schema.js';

const router = express.Router();

//NOTE - 상품 등록 API (POST)
router.post('/products', async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const { title, content, author, password } = req.body;
    //TODO -  title, content, author, password 유효성 검사 추가할것
    const newProduct = new Products({
      title,
      content,
      author,
      password,
    });
    await newProduct.save();
    return res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
    //TODO - 에러를 로깅해야한다.
  }
});

//NOTE - 상품 목록 조회 (GET)
router.get('/products', async (req, res) => {
  try {
    const products = await Products.find()
      .select('_id title author status createdAt')
      .sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
    //TODO - 여기도 에러를 로깅해야한다.
  }
});

//NOTE - 상품 상세 조회 (GET)
router.get('/products/:productId', async (req, res) => {
  try {
    const product = await Products.findById(req.params.productId).select(
      '_id title content author status createdAt'
    );
    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
    //TODO - 여기도 에러를 로깅해야한다.
  }
});

//NOTE - 상품 수정 (PUT)
router.put('/products/:productId', async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const { title, content, password, status } = req.body;
    const product = await Products.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    if (password !== product.password) {
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }
    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    return res.status(201).json({ message: '상품 정보를 수정하였습니다.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
    //TODO - 여기도 에러를 로깅해야한다.
  }
});

//NOTE - 상품 삭제 (DELETE)
router.delete('/products/:productId', async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const productId = req.params.productId;
    const { password } = req.body;
    const product = await Products.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    if (password !== product.password) {
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    await product.deleteOne({ id: productId });
    return res.status(201).json({ message: '상품 정보를 삭제하였습니다.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
    //TODO - 여기도 에러를 로깅해야한다.
  }
});

export default router;
