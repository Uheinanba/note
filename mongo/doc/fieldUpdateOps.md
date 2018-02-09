### $inc
$inc操作符接受正值和负值
```
db.products.update(
    {sku: 'abc123'},
    {$inc: {quantity: -2}}
)
```