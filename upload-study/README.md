# ElementUI - Upload

## slot - trigger & tip
1. 直接在<el-upload>里边写的元素都会触发文件选择上传的弹窗；
2. 如果在<el-upload>里边写的元素加上slot="trigger"，这个元素就可以用于触发文件选择上传弹窗；
3. 如果在<el-upload>里边写的元素加上slot="tip"，这个元素就会默认到<el-upload>的下方显示文案提醒；

## attribute
1. action：上传的地址
2. headers：上传的请求头部
3. multiple：是否多选
4. data：附带参数
5. name：上传的文件字段名
6. with-credentials：cookie由后台写然后上传才会带过去给后台
7. show-file-list：是否显示已上传文件列表
8. drag：是否启用拖拽上传
9. accept：缩略图模式下此字段无效 
   1.  > [accept相关](https://www.runoob.com/tags/att-input-accept.html)
   2.  audio/*
   3.  video/*
   4.  image/*
   5.  MIME_type
10. list-type：文件列表的类型（text/picture/picture-card）
11. auto-upload：选取文件自动上传，autoUpload为false后只执行了handleChange
12. file-list：[{name: name,url:url}]
13. disabled：是否禁用
14. limit：最大允许上传个数

## method：各种属性影响下各种方法调用的先后顺序
1. autoUpload
    1. true：会生成一个fileList但this.fileList不会赋值->handleChange->beforeUpload->\[httpRequest\]->handleProgress->handleSuccess|handleError->handleChange
    2. false：会生成一个fileList但this.fileList不会赋值->handleChange
2. beforeRemove->handleRemove
3. handleExceed：文件超出时提示
4. handleProgress注意要通过event.percent来加载进度条
5. handleSuccess修改fileList
6. beforeUpload：直接用上传文件的大小和类型就没有问题，如果需要图片尺寸大小的校验就需要用promise来判断，之前根据网上的demo写过一段代码，复制以下
7. beforeRemove：删除之前可以进行一些提示然后同样是promise来判断
8. handleRemove：移除文件之后的操作
9. handleChange：文件状态改变时的钩子，file.status="ready|uploading|success|fail"
10. clearFiles：清空已上传的文件列表（该方法不支持在 before-upload 中调用）
11. abort(file: fileList 中的 file 对象)：取消上传请求
12. submit：手动上传文件列表