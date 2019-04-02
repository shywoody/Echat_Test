//
//  EchatStatusManager.h
//  EchatSDKDemo
//
//  Created by xll on 2018/4/18.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "EchatHandShakeModel.h"

//用于各种状态统一管理

@interface EchatStatusManager : NSObject
@property (atomic,assign,readonly) BOOL isPageReady;
@property (atomic,assign,readonly) BOOL isHandShaked;
@property (atomic,assign,readonly) BOOL isUserCloseChat;
@property(nonatomic,assign,readonly) BOOL hasRouteEntrance;
//@property (atomic,assign) BOOL isChatting;
@property (atomic,assign,readonly) BOOL isNeededloadHistory;
@property (atomic,assign,readonly) BOOL isOnChattingWindow;
@property (atomic,assign,readonly) BOOL isForbidden2Forward;
@property (atomic,assign,readonly) BOOL isreStartChat;
@property (atomic,assign,readonly) BOOL isWebFinish;
@property (atomic,assign,readonly) BOOL isCloseDefaultNotification;
@property (atomic,assign,readonly) BOOL isCloseDefaultLocationFunction;
@property (atomic,assign,readonly) BOOL isNeededInfoCollection;
@property (atomic,assign,readonly) BOOL Net;

//属性
@property(nonatomic,strong,readonly) NSString * stfNN;
@property(nonatomic,strong,readonly) NSArray * historyRules;
@property(nonatomic,strong,readonly) NSArray * localNotiRules;
@property(nonatomic,strong,readonly) NSDictionary * lanConfigure;
//消息
@property (nonatomic,strong,readonly) EchatHandShakeModel  * model;

///头像
@property(nonatomic,copy,readonly) NSString * staffHeadURLStr;

///音频地址
@property (nonatomic,copy,readonly) NSString  * recordURL;

/////照相机拍出来的照片
//@property (nonatomic,strong,readonly) NSArray * images;

///视频地址
@property (nonatomic,strong,readonly) id videoPath;

/////截图
//@property (nonatomic,strong,readonly) UIImage * screenShot;

+(instancetype)share;

@end
