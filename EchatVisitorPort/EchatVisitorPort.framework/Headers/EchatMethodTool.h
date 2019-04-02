//
//  EchatMethodTool.h
//  EchatSDKDemo
//
//  Created by xll on 2018/3/30.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "EChatReachability.h"
#import "EchatWSManager.h"
#import "EchatInfo.h"
#import "EchatSessionManager.h"
#import <Photos/Photos.h>
#import <AssetsLibrary/AssetsLibrary.h>

typedef void (^failureBlock)(NSString * failureString);
typedef void (^progressBlock)(CGFloat progress);
typedef void (^ResultPath)(NSURL * filePath);

#define iOSLater(x) [[UIDevice currentDevice] systemVersion].floatValue >= x
#define BeforeiOS(x) [[UIDevice currentDevice] systemVersion].floatValue <= x
#define iOSVersion [[UIDevice currentDevice] systemVersion].floatValue

@interface EchatMethodTool : NSObject
/**
 * @brief obj转string
 * @param data 传入data数据
 * @return 返回一个String
 */
+(NSString *)obj2String:(id)data ;


/**
 * @brief  obj转data
 * @param data 传入data数据
 * @return 返回一个String
 */
+(NSData *)obj2Data:(id)data;


/**
 * @brief  String转字典
 * @param string 传入一个JsonSting
 * @return 返回字典
 */
+(NSDictionary *)string2dic:(NSString *)string;


/*
 * @brief  String转数组
 * @param string 传入一个JsonSting
 * @return 返回数组
 */
+(NSArray *)string2array:(NSString *)string;
/**
 * @brief  读取本地json
 * @param path 本地json地址
 * @return 返回字典
 */
+(NSDictionary * )readLocalJsonFile:(NSString *)path;


/**
 * @brief  生成MessageGroupId
 */
+(NSString *)creatMessageGroupId;


/**
 * @brief  获取当前网络状体啊
 */
+(EChatNetStatus)echat_getCurrentNetStatus;


/**
 * @brief  状态码判断离线
 */
+(BOOL)isCloseChatStatus:(NSString*)str;


/**
 * @brief  状态吗判断客服反馈是否关闭
 */
+(BOOL)isStaffClose:(NSString*)str;


/**
 * @brief  判断文件格式是否正确
 */
+(BOOL)isRightfulFileType:(NSString *)fileName;

/**
 * @brief  判断文件大小是否超出限制
 * @param length 大小数值
 */
+(BOOL)isOverUPloadSizeLimit:(NSInteger)length;


/**
 * @brief 返回上传参数规则转换的成字典
 */
+(NSDictionary *)transFromRuler2DicWith:(NSString *)rule;

/**
 * @brief  图片压缩
 * @param maxLength 最大压大小
 * @param image 传入图片
 * @return 返回二进制流
 */
+(NSData *)compressWithMaxLength:(NSUInteger)maxLength image:(UIImage*)image;

///
/**
 * @brief 获取视屏第一帧
 * @param path 视频地址
 * @return 返回图片
 */
+ (UIImage*)getVideoPreViewImage:(NSURL *)path;

/**
 * @brief  获取相册视频地址
 */
+(void)getVideoPathFromAsset:(id)asset Complete:(ResultPath)result;

+(void)getImagePathFromAsset:(id)asset Complete:(ResultPath)complete;


#pragma mark -- Private Method
#pragma mark -- NetWork provite
///上传单张拍摄图片
+(void)upLoadImage:( NSData *)imageData
      andTokenData:(NSDictionary *)dict
        serverType:(NSInteger)type
       statrUpload:(dispatch_block_t)start
           Success:(dispatch_block_t)success
          progress:(progressBlock)progress
           failure:(failureBlock)failure;

///上传音频
+(void)upLoadVoice:(NSString *)recordPath
      andTokenData:(NSDictionary *)dict
        serverType:(NSInteger)type
       statrUpload:(dispatch_block_t)start
           success:(dispatch_block_t)success
          progress:(progressBlock)progress
           failure:(failureBlock)failure;

///上传视频
+(void)upLoadVideo:(id)filePath
          andImage:(NSData *)imageData
      andTokenData:(NSDictionary *)dict
        serverType:(NSInteger)type
       statrUpload:(dispatch_block_t)start
           success:(dispatch_block_t)success
          progress:(progressBlock)progress
           failure:(failureBlock)failure;

+(void)downLoadJsonFile:(NSString *)urlString
               complete:(void(^)(NSDictionary * json))success
                failure:(void(^)(NSError * error))failure;

+(void)downloadFileWith:(NSString *)urlString
                 ToPath:(NSString *)filePath
                success:(dispatch_block_t)success
                failure:(failureBlock)failure;

+(void)downloadPicWithURL:(NSString * )urlString
                 filePath:(NSString * )filePath
                 Progress:(void(^)(NSString * progress))progress
                  Success:(void(^)(NSURL * fileUrl))success
                   failue:(void(^)(NSError * error))failure;

+(void)upDatePushInfoWithParams:(NSDictionary *)params success:(dispatch_block_t)success failure:(void(^)(NSError * error))failure;
+(void)unReadMsgCountWithParams:(NSDictionary *)params success:(void(^)(NSInteger count))success failure:(void(^)(NSError * error))failure;
///清除网络请求
+(void)clearNetWorks;

///获取页面上显示的控制器
+(UIViewController *)getCurrentViewController;

///获取到页面上显示的控制器之后,选择一个控制器跳转
+(void)echat_jump2viewControllerByLocalNoti:(UIViewController *)vc;
+(void)mergeContentsOfPath:(NSString *)srcDir intoPath:(NSString *)dstDir error:(NSError**)err;
+(UIImage *)getImageFromSDK:(NSString *)imageName;
@end
