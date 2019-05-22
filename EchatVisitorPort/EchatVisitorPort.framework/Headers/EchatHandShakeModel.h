//
//  EchatHandShakeModel.h
//  socketDemo
//
//  Created by xll on 2018/3/29.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "EchatRouteEntranceInfoModel.h"
#import "NSObject+EchatModel.h"



///握手data参数
@interface EchatHandShakeData: NSObject<EchatModel>
@property (nonatomic,copy) NSString  * apiServerDomain;
@property (nonatomic,assign) NSInteger  companyId;
@property (nonatomic,copy) NSString  * encryptVID;
@property (nonatomic,copy) NSString  * lan;
@property (nonatomic,assign) NSInteger  mid;
@property (nonatomic,assign) NSInteger  mst;
@property (nonatomic,copy) NSString  * mt;
@property (nonatomic,copy) NSString  * fileBucketDomain;
@property (nonatomic,copy) NSString  * fileBucketHttpsDomain;
@property (nonatomic,copy) NSString  * fileUploadHttpsUrl;
@property(nonatomic,strong) NSArray * fileUploadInfos;
@property (nonatomic,copy) NSString  * fileUploadParam;///上传参数
@property (nonatomic,copy) NSString  * fileUploadUrl;
@property (nonatomic,copy) NSString  * localPushRule;   ///本地推送规则
@property (nonatomic,copy) NSString  * remotePushRule; ///远程推送规则
@property (nonatomic,strong) NSString  * routeEntranceInfoString;
@property (nonatomic,strong) EchatRouteEntranceInfoModel  * routeEntranceInfo;
@property(nonatomic,strong) NSString * i18nConfig;
@property (nonatomic,copy) NSString  * sessionId;
@property (nonatomic,assign) NSInteger   tm;
@property (nonatomic,copy) NSString  * unreadMsgRule;///未读消息规则
@property (nonatomic,assign) NSInteger   uploadFileSize;///文件上传大小限制
@property (nonatomic,copy) NSString  * uploadFileType;//文件上传格式
@property (nonatomic,assign) NSInteger vcs;
@property (nonatomic,copy) NSString  * visitorId;
@property (nonatomic,assign) NSInteger  visitorSessionSize;
@property (nonatomic,assign) NSInteger  visitorType;
@end


///握手参数
@interface EchatHandShakeModel : NSObject<EchatModel>
@property (nonatomic,strong) NSDictionary  * ext;
@property (nonatomic,copy) NSString  *  minimumVersion;
@property (nonatomic,copy) NSString  *  clientId;
@property (nonatomic,strong) EchatHandShakeData  * data;
@property (nonatomic,strong) NSArray  * supportedConnectionTypes;
@property (nonatomic,copy) NSString   * channel;
@property (nonatomic,copy) NSString  * ID;
@property (nonatomic,copy) NSString  * version;
@property (nonatomic,assign) BOOL  successful;
@end
