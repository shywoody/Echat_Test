//
//  EchatViewController.h
//  EchatSDKDemo
//
//  Created by xll on 2018/3/30.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <UIKit/UIKit.h>
@class Echat_accessConditions;
@class Echat_LocationVC;

typedef void(^VisEvtCallBack)(NSString * data);
@interface EchatViewController : UIViewController

//自定义地图控制器
@property(nonatomic,strong) Echat_LocationVC *  mapLoaderViewController;

///自定义图库控制器
@property(nonatomic,strong) UIViewController * imagePickerLoaderViewController;

///图文消息如果type是custom则会返回字段供开发者自己去操作
@property (nonatomic,copy) VisEvtCallBack visEvtCallBackblock;


///构造函数
-(instancetype)initWithAccess:(Echat_accessConditions *)access;
@end


