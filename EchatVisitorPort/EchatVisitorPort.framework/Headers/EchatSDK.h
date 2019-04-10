//
//  EchatSDK.h
//  EchatSDKDemo
//
//  Created by mac on 2018/7/19.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>
@class EchatWSManager;
@class EchatViewController;
@class Echat_accessConditions;
@interface EchatSDK : NSObject
+(instancetype)share;
-(void)AppID:(NSString *)appid AppSecret:(NSString *)appsecret;
-(EchatViewController *)chatViewController:(Echat_accessConditions *)condition;
-(void)echat_closeDefaultNotification:(BOOL)isClose;
-(void)echat_closeDefaultLocationFunction:(BOOL)isClose;
-(void)echat_sendLocationInfo:(NSDictionary *)info;
+(void)echat_registPushInfo:(NSString *)pushInfo isThirdPush:(BOOL)istp;
///文件缓存大小
+(double)getMemorySize;
//清除缓存
-(void)cleanMemory;
@end
