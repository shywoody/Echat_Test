//
//  Echat_LocationVC.h
//  EchatSDKDemo
//
//  Created by xll on 2018/5/9.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^Echat_sendLocationBlock)(NSDictionary * data);
@interface Echat_LocationVC : UIViewController
@property(nonatomic,copy) NSString * leftItemImageName;///leftItemImageName
@property(nonatomic,copy) NSString * rightItemImageName;///rightItemImageName
@property(nonatomic,copy) Echat_sendLocationBlock sendLocationCallBack;

/// 初始化控制器
/// @param mapKey 高德地图申请key
+ (instancetype)locationVCWithMapKey:(NSString *)mapKey;

/// 初始化控制器
/// @param mapKey 高德地图申请key
- (instancetype)initWithMapKey:(NSString * )mapKey;
@end
