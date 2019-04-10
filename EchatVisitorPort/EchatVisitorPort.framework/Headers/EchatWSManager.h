//
//  EchatWSManager.h
//  EchatSDKDemo
//
//  Created by xll on 2018/3/30.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Echat_unReadMsg.h"
#import "EchatVisitorPort.h"
#import "EchatWebSocket.h"
#import "EchatPMWarehouse.h"



//握手状态
//握手状态
typedef NS_ENUM(NSInteger,EchatHandShakeStatus){
    EchatHandShakeWaiting = 0,
    EchatHandShakeSucceed = 1,
    EchatHandShakeNone = 2,
};

typedef void(^UnReadMsgBlock)(Echat_unReadMsg * unReadMsg);
typedef void(^UnReadMsgCountBlock)(NSInteger count);


@interface EchatWSManager : NSObject

@property (nonatomic,weak) id<EchatWebSocketManagerDelegate>  delegate;

///未读消息数回调
@property (nonatomic,copy) UnReadMsgCountBlock unReadMsgCountCallBack;

///未读消息回调
@property (nonatomic,copy) UnReadMsgBlock  unreadMsgCallBack;

@property(nonatomic, readonly,assign) NSInteger unReadMsgCount;

//远程推送参数
@property(nonatomic,copy) NSString * pushInfo;

//是否是三方推送标识
@property(nonatomic,assign,readonly) BOOL isTP;


+(instancetype)share;

///打开ws
-(void)openWS;

///重连ws
-(void)reConnectWS;

//关闭ws
-(void)close;


//相册上传照片或者视频接口
///自定义相册上传图片数组
-(void)uploadImagesArrayFromImagePicker:(NSArray<UIImage*>*)photos;

///自定义相册上传video   注:如果系统版本大于iOS8，asset是PHAsset类的对象，否则是ALAsset类的对象
-(void)uploadVideoFromImagePickerWithCoverImage:(UIImage *)image and:(id)asset;

///发送地理位置消息
-(void)echat_sendLocationInfo:(NSDictionary*)dict;

///给h5消息
-(void)drawMessages4H5:(NSDictionary *)dict;

///取得ws-status
-(EchatReadyState)getWSstatus;

///获得未读消息计数
//-(void)getUnReadMsgCount:(void(^)(NSInteger count))countBlock;
@end

