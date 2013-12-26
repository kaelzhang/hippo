# hippo

> Dianping Web Analytics

### 如果阅读完文档之后，还有任何疑问，可以直接在项目中提交新 [issue](http://code.dianpingoa.com/f2ei/hippo/issues) 来提问。

## Synopsis

示例代码见 [这里](http://i1.static.dp/demo/hippo.html)

### 基本语法

```
_hip.push(action);
```

例如：发送一个 mv

```
_hip.push(['mv', {...}]);
```

## Actions

### 发送 module view 请求

```
['mv', data_object]
```

#### 示例

```
_hip.push(['mv', {
    module: '6_rec_fujin',
    action: 'click'
}]);
```

### 发送 page view 请求

```
['pv', data_object]
```

请 **特别注意**，大部分情况下，只要页面中加入 hippo，会自动发送一个 pv 请求，因此一般情况下，不需要主动调用该 action。

如果要禁止页面自动发送，请参见下面条目。 

### 设置初始 pv 的参数

设置自动发送的 pv 请求的数据。请注意，这个方法只会被运行一次。

```
['_setPVInitData', data_object]
```

### 禁止自动发送 pv

```
['_autoPV', false]
```

请注意，如果要让该代码生效，需要在 hippo.js 加载前，将其加入到初始化代码中。

### 禁止自动进行页面性能统计

```
['_autoPageTiming', false]
```
请注意，如果要让该代码生效，需要在 hippo.js 加载前，将其加入到初始化代码中。

### 设置页面的 page_id 

```
['_setPageId', page_id]
```

若新业务无法确定自己的 page_id，则该代码行都不出现.

### 设置页面的 city_id 

```
['_setCityId', city_id]
```

城市 id，如上海的 city_id 为 1。有些业务跟城市无关，如后台等，则该代码行可不出现。

### 设置页面的 shop_type

_deprecated_

```
['_setShopType', shop_type]
```

目前，我们的网站上仅有 Category=1000 的页面，才会有 shop_type，因此，对于其他的页面，shop_type 可以传 0，或者该代码行都不出现.

### 强制指定页面的地址

```
['_setHref', href]
```
##### 说明

对于普通页面，请 **慎用** 该方法。


### 强制指定页面的 referrer

注意拼写：

```
['_setReferrer', referrer]
```
##### 说明

1.
如果你的页面，使用了某些 JavaScript MVC 框架来进行页面的渲染和路由，并且使用了 hash 来进行路由的操作，那么 `'_setReferrer'` 和 `'_setHref'` 方法会帮到你。
但是 `referrer` 以及 `href` 的取值需要业务自己来管理。

2.
对于普通页面，请 **慎用** 该方法。


### 设置服务端 GUID

```
['_setGuid', guid]
```

### 设置页面的 Request ID

```
['_setRequestId', requestId]
```

## 初始化

### 特别说明

若您的业务，已经调用了页头服务（dp-common-web），那么在使用上，可以跳过 \<1\> 与 \<2\> 的步骤，因为页头服务已经默认包含 hippo.js 与 初始化的代码。

### 1. 页面顶部 JavaScript

	<script>
	var _hip = [
	    ['_setPageId', page_id],
	    ['_setCityId', city_id],
	    ['_setShopType', shop_type],
	    ['_setPVInitData', page_initial_data]
	];
	</script>

上面的初始化代码片段，必须位于 web 页面源代码的 <head></head> 标签内，建议放置到页面所有的 JavaScript 代码块之前。


#### 说明

1. `_hip` 数组中，可以使用上面 "actions" 章节中说明的 action。
2. 若所有的参数，在某个业务中均不需要设置，则代码为:

```
<script>
var _hip = [];
</script>
```

#### 原理

1. 当 hippo 的 JavaScript 文件被运行前，`_hip` 是一个 JavaScript 数组，我们可以使用数组的 `push` 方法给它加入更多的项（action）。这个时候 `_hip` 数组起到了一个简易的队列的作用。
2. 当 JS 文件被运行之后，`_hip.push` 会变为一个自定义的函数，用来执行 hippo 相关的逻辑，同时原来的 `_hip` 数组中的项，会作为新的 `_hip.push` 函数的参数被执行。


### 2. 依赖的 JS 文件

A. 若您所负责的业务访问量较大，建议依赖 dp-common，并使用 <@ava.staticResource> tag 来引入 "/hls/hippo2.js"

B. 若您所负责的业务生命周期较短，则可直接调用 http://i1.dpfile.com/hls/hippo2.js


## 参数说明

### data_object

#### 参考文档

[https://docs.google.com/a/dianping.com/spreadsheet/ccc?key=0At4dklODGW9UdFg5VHJBdmo3YlZ0VVpkRFh6cFNyQkE#gid=2](https://docs.google.com/a/dianping.com/spreadsheet/ccc?key=0At4dklODGW9UdFg5VHJBdmo3YlZ0VVpkRFh6cFNyQkE#gid=2)

#### 说明

`data_object` 是一个 JavaScript 数据对象，类似于 HashMap，
它是由多个 key-value 对组成的，比如：

```
{
    module: '1_rec_qita',
    index: 1,
    action: 'click'
} 
```

其中

##### key: module
在一个 hippo 打点中，module 是一个很重要的 key，它用于对当前的 hippo 打点起到“身份验证”的作用，在进行数据统计的时候，大多时候会首先根据 module 来进行筛选。

所以，在收到 hippo 打点需求的时候，首先应当确定该打点的 module 名。

module 名需要开发，BI，与需求方进行约定。

##### 其他 key
其他key，一般为描述性的键，这些键的含义及用法，可以参考上面的文档。


