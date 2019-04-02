//
//  Echat_accessConditions.h
//  EchatSDKDemo
//
//  Created by xll on 2018/6/22.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Echat_visEvtModel.h"
@interface Echat_accessConditions : NSObject<NSCoding>
///会员数据参数
@property (nonatomic,copy) NSString  * metaData;

///自定义扩展参数
@property (nonatomic,copy) NSString  * myData;

///消息推送字段
@property (nonatomic,copy) NSString  * pushInfo;

///入口/入口标签
@property (nonatomic,copy) NSString  * echatTag;

///自定义对话窗口语言
@property (nonatomic,copy) NSString  * lan;

///图文消息
@property (nonatomic,strong) Echat_visEvtModel  * visEvt;
//@property(nonatomic,strong) NSDictionary * visEvt;

///咨询入口id
@property (nonatomic,copy) NSString * routeEntranceId;

///机器人接入策略
//@property (nonatomic,assign) int rbPlicy;

@end
