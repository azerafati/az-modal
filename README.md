# az Modal

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] ![Coveralls github](https://img.shields.io/coveralls/github/azerafati/az-modal.svg) ![Github file size](https://img.shields.io/github/size/azerafati/az-modal/dist/az-modal.min.js.svg)



#### Modal service for AngularJS using Bootstrap

This is a very simple and minimal but handy service written to let you call a bootstrap modal with a template and a controller and pass some arguments to the controller. 

So basically you can write:

```
azModal.show({
    templateUrl: '/app/product/product-detail.html',
    controller : 'productDetailCtrl',
    locals: {product:product}

});

```
And a Bootstrap modal will be displayed with `product` injected into decencies of `productDetailCtrl` controller. 


Demo: 
https://azerafati.github.io/az-modal/













[npm-url]: https://www.npmjs.com/package/az-modal
[npm-image]: https://img.shields.io/npm/v/az-modal.svg

[travis-url]: https://travis-ci.org/azerafati/az-modal
[travis-image]: https://api.travis-ci.org/azerafati/az-modal.svg?branch=master

[coverage-image]: https://img.shields.io/codecov/c/github/azerafati/az-modal.svg
[coverage-image]: https://img.shields.io/bundlephobia/min/az-modal.svg

[license-image]: https://img.shields.io/npm/l/express.svg

[issues-image]: https://img.shields.io/github/issues/badges/shields.svg
