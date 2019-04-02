//
//  EchatWebSocket.h
//  socketDemo
//
//  Created by xll on 2018/3/30.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Security/SecCertificate.h>

//预备状态
typedef NS_ENUM(NSInteger, EchatReadyState) {
    Echat_CONNECTING   = 0,
    Echat_OPEN         = 1,
    Echat_CLOSING      = 2,
    Echat_CLOSED       = 3,
};

//状态码
typedef enum EchatStatusCode : NSInteger {
    // 0–999: Reserved and not used.
    EchatStatusCodeNormal = 1000,
    EchatStatusCodeGoingAway = 1001,
    EchatStatusCodeProtocolError = 1002,
    EchatStatusCodeUnhandledType = 1003,
    // 1004 reserved.
    EchatStatusNoStatuEchateceived = 1005,
    EchatStatusCodeAbnormal = 1006,
    EchatStatusCodeInvalidUTF8 = 1007,
    EchatStatusCodePolicyViolated = 1008,
    EchatStatusCodeMessageTooBig = 1009,
    EchatStatusCodeMissingExtension = 1010,
    EchatStatusCodeInternalError = 1011,
    EchatStatusCodeServiceRestart = 1012,
    EchatStatusCodeTryAgainLater = 1013,
    // 1014: Reserved for future use by the WebSocket standard.
    EchatStatusCodeTLSHandshake = 1015,
    // 1016–1999: Reserved for future use by the WebSocket standard.
    // 2000–2999: Reserved for use by WebSocket extensions.
    // 3000–3999: Available for use by libraries and frameworks. May not be used by applications. Available for registration at the IANA via first-come, first-serve.
    // 4000–4999: Available for use by applications.
} EchatStatusCode;

@class EchatWebSocket;

extern NSString *const EchatWebSocketErrorDomain;  //错误域
extern NSString *const EchatHTTPResponseErrorKey;   //状态码

#pragma mark - EchatWebSocketDelegate
//协议
@protocol EchatWebSocketDelegate;

#pragma mark - EchatWebSocket

//这个对象就是做链接，接受，和发送数据到远程网络插座(遵循steamDelegate)
@interface EchatWebSocket : NSObject <NSStreamDelegate>
//代理
@property (nonatomic, weak) id <EchatWebSocketDelegate> delegate;
//状态  默认是Echat_CONNECTING 利用kvo 线程是安全的
@property (nonatomic, readonly) EchatReadyState readyState;
//url对象
@property (nonatomic, readonly, retain) NSURL *url;
//所有能接收到的http的头
@property (nonatomic, readonly) CFHTTPMessageRef receivedHTTPHeaders;
/* Optional array of cookies (NSHTTPCookie objects) to apply to the connections
 所有用于连接的cookies都在这个数组里(数组里是NSHTTPCookie对象)
 */
@property (nonatomic, readwrite) NSArray * requestCookies;

/* This returns the negotiated protocol.
 It will be nil until after the handshake completes.
 这个返回的是已经谈判的协议
 这个属性只有在握手完成之后才为nil
 */
@property (nonatomic, readonly, copy) NSString *protocol;

/* Protocols should be an array of strings that turn into Sec-WebSocket-Protocol.
 协议应该是字符串数组变成秒WebSocket协议
 */
- (id)initWithURLRequest:(NSURLRequest *)request protocols:(NSArray *)protocols allowsUntrustedSSLCertificates:(BOOL)allowsUntrustedSSLCertificates;
- (id)initWithURLRequest:(NSURLRequest *)request protocols:(NSArray *)protocols;
- (id)initWithURLRequest:(NSURLRequest *)request;

/* Some helper constructors.
 一些辅助构造函数
 */
- (id)initWithURL:(NSURL *)url protocols:(NSArray *)protocols allowsUntrustedSSLCertificates:(BOOL)allowsUntrustedSSLCertificates;
- (id)initWithURL:(NSURL *)url protocols:(NSArray *)protocols;
- (id)initWithURL:(NSURL *)url;

/* Delegate queue will be dispatch_main_queue by default.
 You cannot set both OperationQueue and dispatch_queue.
 代理的队列默认是主队列,并且你不能同时设置这两个东西
 */
- (void)setDelegateOperationQueue:(NSOperationQueue*) queue;
- (void)setDelegateDispatchQueue:(dispatch_queue_t) queue;

/* By default, it will schedule itself on +[NEchatunLoop Echat_networkRunLoop] using defaultModes.
 默认下,它会安排自己在[NEchatunLoop Echat_networkRunLoop] 这个runloop中采用默认的模式
 */

- (void)scheduleInRunLoop:(NSRunLoop *)aRunLoop forMode:(NSString *)mode;
- (void)unscheduleFromRunLoop:(NSRunLoop *)aRunLoop forMode:(NSString *)mode;

/* EchatWebSockets are intended for one-time-use only.  Open should be called once and only once.
 EchatWebSockets 默认下一个时间只能用一次，所以这个打开的方法应该只能开一次
 */
- (void)open;

- (void)close;
- (void)closeWithCode:(NSInteger)code reason:(NSString *)reason;

/*Send a UTF8 String or Data.
 使用UTF-8的字符串或者data二进制数据
 */
- (void)send:(id)data;

/* Send Data (can be nil) in a ping message.
 发送data二进制数据(可以为空)在一个ping message中(为了检测网络状态?)
 */
- (void)sendPing:(NSData *)data;

@end

#pragma mark - EchatWebSocketDelegate

@protocol EchatWebSocketDelegate <NSObject>

/* message will either be an NSString if the server is using text or NSData if the server is using binary.
 信息可能是一个sting或者是NSData二进制看服务器返回时什么
 */
- (void)webSocket:(EchatWebSocket *)webSocket didReceiveMessage:(id)message;

@optional
//可选代理方法
- (void)webSocketDidOpen:(EchatWebSocket *)webSocket;
- (void)webSocket:(EchatWebSocket *)webSocket didFailWithError:(NSError *)error;
- (void)webSocket:(EchatWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean;
- (void)webSocket:(EchatWebSocket *)webSocket didReceivePong:(NSData *)pongPayload;

/* Return YES to convert messages sent as Text to an NSString. Return NO to skip NSData -> NSString conversion for Text messages. Defaults to YES.
 返回yes的话就是文本，返回no就是二进制
 */
- (BOOL)webSocketShouldConvertTextFrameToString:(EchatWebSocket *)webSocket;

@end

//分类
#pragma mark - NSURLRequest (EchatCertificateAdditions)

@interface NSURLRequest (EchatCertificateAdditions)

@property (nonatomic, retain, readonly) NSArray *Echat_SSLPinnedCertificates;

@end

#pragma mark - NSMutableURLRequest (EchatCertificateAdditions)

@interface NSMutableURLRequest (EchatCertificateAdditions)

@property (nonatomic, retain) NSArray *Echat_SSLPinnedCertificates;

@end

#pragma mark - NEchatunLoop (EchatWebSocket)

@interface NSRunLoop (EchatWebSocket)

+ (NSRunLoop *)Echat_networkRunLoop;

@end
