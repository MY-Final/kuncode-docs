# 常见问题

以下问题与具体服务商无关，适用于任何兼容网关。

想按状态码系统排查，看[错误码与排障](/guide/errors)。

## 返回 401 Unauthorized

详见[错误码与排障 · 401](/guide/errors#_401-unauthorized)。

1. 确认 Key 完整复制，没有多余空格或换行。
2. 确认请求头是 `Authorization: Bearer sk-xxx`。
3. 确认密钥未过期、未被禁用、额度未用尽。
4. 用 `curl` 直接验证，排除工具自身的配置问题。

```bash
curl https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

## 返回 404 Not Found

详见[错误码与排障 · 404](/guide/errors#_404-not-found)。

- Base URL 写错，或带了多余路径。
- 服务不支持该协议入口。
- 工具自动拼接了重复的 `/v1`。

## 模型不存在

调用 `/v1/models` 拿到真实可用的模型名，再填回配置。注意模型不存在通常返回 503，不是 404。

详见[模型与能力](/guide/models)和[错误码与排障 · 503](/guide/errors#_503-service-unavailable)。

## 请求超时

详见[错误码与排障 · 504](/guide/errors#_504-gateway-timeout)。

- 检查本机网络与代理设置。
- 换一个模型或渠道重试，排除上游问题。
- 若只有长请求超时，考虑调大工具的超时配置。

## 费用与用量对不上

在服务商的日志或账单页面按时间范围筛选，核对每次请求的输入、输出、缓存与费用明细。
本文档不假定你使用某个特定平台，具体入口请参考你所用服务的文档。
