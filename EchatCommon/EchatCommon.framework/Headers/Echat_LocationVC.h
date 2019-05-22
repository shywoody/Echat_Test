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
@property(nonatomic,copy) Echat_sendLocationBlock sendLocationCallBack;
- (instancetype)initWithMapKey:(NSString * )mapKey;
@end
