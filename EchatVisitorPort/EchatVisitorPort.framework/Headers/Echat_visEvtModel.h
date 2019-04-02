//
//  Echat_visEvtModel.h
//  EchatSDKDemo
//
//  Created by xll on 2018/6/22.
//  Copyright © 2018年 xielang. All rights reserved.
//

//图文消息
#import <Foundation/Foundation.h>
#import "EchatModel.h"
@interface Echat_visEvtModel : NSObject<NSCoding>
@property (nonatomic,copy) NSString  * content;
@property (nonatomic,strong) NSNumber * customizeMsgType;
@property (nonatomic,strong) NSNumber *  dedup;
@property (nonatomic,copy) NSString  * eventId;
@property (nonatomic,copy) NSString  * imageUrl;
@property (nonatomic,copy) NSString  * memo;
@property (nonatomic,copy) NSString  * title;
@property (nonatomic,copy) NSString  * url;

/////图文消息提供给访客打开的url
//@property(nonatomic,copy) NSString * urlForVisitor;
//
/////图文消息提供给客服打开的url，可以为空
//@property(nonatomic,copy) NSString * urlForStaff;

///图文消息的可见范围.1:访客客服都可见（默认）2:只有客服可见，访客不可见
@property(nonatomic,strong) NSNumber *  visibility;
@property(nonatomic,strong) NSNumber *  urlEnableForVisitor;

@end
