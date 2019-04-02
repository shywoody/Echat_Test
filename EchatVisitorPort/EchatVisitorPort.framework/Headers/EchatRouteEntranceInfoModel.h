//
//  EchatRouteEntranceInfoModel.h
//  EchatSDKDemo
//
//  Created by xll on 2018/6/13.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>

///咨询入口
@interface EchatRouteEntranceInfoModel : NSObject
@property (nonatomic,copy) NSString  * companyId;
@property (nonatomic,strong) NSArray  * customizeLanguages;
@property (nonatomic,copy) NSString  * defaultIcon;
@property (nonatomic,copy) NSString  * entranceDetails;
@property (nonatomic,copy) NSString  * lan;
@property (nonatomic,copy) NSString  * lines;
@property (nonatomic,copy) NSString  * media;
@property (nonatomic,copy) NSString  * routeEntranceId;
@property (nonatomic,copy) NSString  * routeEntranceMedia;

/*"routeStatusList":[
 {
 "routeId":"320",
 "routeStatus":1
 },
 {
 "routeId":"320",
 "routeStatus":1
 }
 ]
 */
@property (nonatomic,strong) NSArray  * routeStatusList;
@property (nonatomic,copy) NSString  * title;
@end

