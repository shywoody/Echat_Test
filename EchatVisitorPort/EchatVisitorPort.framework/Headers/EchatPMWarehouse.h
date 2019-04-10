//
//  EchatPMWarehouse.h
//  EchatSDKDemo
//
//  Created by mac on 2018/8/23.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "EchatInfo.h"

#pragma  mark -- n
@protocol EchatPMWarehouse <NSObject>

@end

@protocol EchatWebSocketManagerDelegate<NSObject>
@optional
-(void)echat_CallJSWithFunctionWithFunctionName:(NSString *)functionName andValue:(id)value;
-(void)echat_CallJSWhenConnectWithFunctionName:(NSString *)functionName andValue:(id)value;
-(void)removeHUD;
-(void)echat_Error:(int)code;
-(void)echat_internationalizationConfigure:(NSString * )configure;
-(void)echat_UICode:(int)code data:(NSDictionary *)dict;
@end

@protocol EchatJSBridgeDelegate<NSObject>
@optional
-(void)echat_bridgeCallJS:(NSString *)functionName andValue:(id)value;

//callEchatJsConnect
- (void)echat_bridgeCallJSConnect:(NSString *)functionName andValue:(id)value;

///关闭聊天窗口
-(void)echat_bridge4closeChatView;

//移除hud
-(void)echat_removingHud;

//对话状态
-(void)echat_bridge4chatStatus:(NSString * )status;

//访客状态
-(void)echat_bridge4visitorEvaluate:(NSString * )result;

//发送多媒体数据
-(void)echat_sendMedia2WS:(NSString * )value;

///播放视频
-(void)echat_bridge4playVideo:(NSString *)path;

///播放音频
-(void)echat_bridge4playAudio:(NSURL *)path;

///打开下载文件
-(void)echat_bridge4OpenDownLoadFile:(NSString *)name;

///上传失败文件
-(void)echat_bridge4resendFailureFiles:(NSDictionary *)dataDict;

///发送地图
-(void)echat_bridgeOPenMap;

///图片预览
-(void)echat_bridge4PreviewImage:(NSDictionary *)dict;

///图文消息展示
-(void)echat_bridge4displayVisEvt:(NSDictionary *)dict;

-(void)echat_bridge4closeDisplayVisEvtView;

-(void)echat_bridge4SendH5lan:(NSString *)jsfuc;

-(void)echat_bridge2GetDataHost:(NSString *)jsfuc;

-(void)echat_bridgeSendErrorCode:(NSInteger)code;

-(void)echat_bridge4CheckConnection;

-(void)tes:(int)code;
@end

#pragma mark -- p
@protocol EchatWSPP <NSObject>
///消息队列
-(void)getMessage2H5FromTube;
-(void)getUpLoadTokenWithType:(Echat_UPLoadFileType)type andClientFileId:(NSString *)clientFileId andVoiceDuration:(NSInteger)duration;
//-(void)getUpLoadTokenWithType:(Echat_UPLoadFileType)type andVoiceDuration:(NSInteger)duration;
-(void)sendEtChat:(NSString *)string value:(NSDictionary *)dict;
-(void)closeChat;
@end

@protocol EchatSMPP <NSObject>
@optional
//定时器
-(void)echat_GCDtimerWithName:(NSString *)timerName timeInterval:(double)interval queue:(dispatch_queue_t)queue repeats:(NSInteger)repeatsCount action:(void(^)(NSString * timerName))action complete:(dispatch_block_t)complete;
-(void)echat_OneceGCDtimerWithName:(NSString * )name andTimeInterval:(double)interval callBack:(void(^)(dispatch_source_t timer))callBack;
//移除定时器
-(void)echat_cancelTimeWithName:(NSString *)timerName;
-(void)echat_cancelOnceTimeWithName:(NSString *)timerName;
///清除所有定时器
-(void)cancelAlltimer;
//imagPaths
-(void)inserImagePathsWithfileClientId:(NSString * )fileClientId andPath:(NSString *)path;
-(NSString *)getImagePathsWithfileClientId:(NSString * )fileClientId;


@end

@protocol EchatVoicePP <NSObject>
///发送语音
- (void)sendVisitorVoice:(NSDictionary *)dictionary;
@end

@protocol EchatPVPP <NSObject>
///播放音频
- (void)createAudioPlayer:(NSURL *)url;
@end

@protocol EchatAVPPP <NSObject>
///播放
- (void)creatAVPlerController:(__kindof UIViewController *)controller url:(NSURL * )url;
@end

@protocol EchatDBPP <NSObject>
@optional
-(void)keepMessageGroupID;
-(void)addTalkID2CurrentGroupIdWithTalkId:(NSString * )talkId andVisitorId:(NSString *)visitorId;
-(void)keepData2WSDB:(NSDictionary * )dict andVisitor:(NSString *)visitorId  andisForbidden:(BOOL)isForbidden;
-(void)keepDatas2WSDBByTransaction:(NSArray *)dataArray andVisitorId:(NSString *)visitorId andisForbidden:(BOOL)isForbidden;
-(void)keepUnSuccessFulSendMessage:(NSMutableDictionary *)data andBridgeMsgId:(NSString * )bridgeMsgId andVisitorId:(NSString *)visitorId;
-(void)upDateTalkIdType:(int)talkIdType;
-(void)updateUnSuccessFulMsg:(NSMutableDictionary*)data and:(id)bridgeMsgId sendStatus:(int)sendStatus;
-(void)getMessageFromLocal:(void(^)(NSArray * chatDetailList,NSNumber * talkId , NSNumber * talkIdType))callBack;
-(void)getHistoryFromDB:(NSString *)talkId complete:(void(^)(NSArray * callback,NSString * talkId,NSNumber * talkIdType))callBack;
-(void)getAllTalkIds:(void(^)(NSArray * talkIds))callback;
-(void)getUnreadMessageFromDB:(void(^)(NSArray * chatdict))callBack;
-(void)upDateUnRead2Read;
-(void)getComleteConversationWhenGet10009:(void(^)(NSDictionary * value))complete;
-(void)getloadLatestConversationTalkId:(NSString *)talkId complete:(void(^)(NSString * talkId))callBack;
-(void)deleteUnsuccessfulsendedMsgWithBridgeMsgId:(NSString *)bridgeMsgId complete:(void(^)(BOOL isSuccess))complete;
-(void)writePreloadFileDataWithClientFileId:(NSString *)clientFileId
                               andLocalFile:(NSString *)localFilePath
                              andLocalVideo:(NSString *)localVideoPath
                                andDuration:(int)duration
                                andFileType:(int)fileType
                                 andMsgType:(int)msgType
                                      andMt:(NSString *)mtString
                                   complete:(void(^)(NSDictionary * dataDict))complete;
-(void)writeDownLoadFileWith:(NSDictionary *)dataDict complete:(void(^)(NSDictionary * dict))complete;
-(NSMutableDictionary *)getFileMessageWithClientFileId:(NSString *)clientFileId andIdentityKey:(NSString *)identityKey;
-(void)updateFileDataWhenCirculatingWithClientFileId:(NSString *)clientFileId andData:(NSDictionary *)dictData;
-(void)upDateIMGFileDataWhenFinishedWithData:(NSDictionary *)dictData complete:(void(^)(NSDictionary * data))complete;
-(void)upDateFileDataWhenFinishedWithData:(NSDictionary *)dictData complete:(void(^)(NSDictionary * data))complete;
-(void)getFileInfo:(NSString * )clientFileId complete:(void(^)(NSDictionary * dataDict))complete;
-(void)updateDownLoadFileStatesWith:(NSString *)fileIdentity state:(int)state progress:(int)progress filePath:(NSString *)filePath complete:(void(^)(NSDictionary * dict))complete;
-(NSDictionary *)getDownLoadFileData:(NSString *)fileIdentity;
-(void)updateFileStateWith:(NSString *)identity status:(int)status complete:(void(^)(NSDictionary * dataDict))complete;
-(void)resendFileWith:(NSString *)clientFileId complete:(void(^)(NSDictionary * dataDict))complete;

@end


