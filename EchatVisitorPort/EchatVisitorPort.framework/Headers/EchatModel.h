//
//  EchatModel.h
//  socketDemo
//
//  Created by xll on 2018/3/29.
//  Copyright © 2018年 xielang. All rights reserved.
//

#import <Foundation/Foundation.h>

#if __has_include(<EchatModel/EchatModel.h>)
FOUNDATION_EXPORT double EchatModelVersionNumber;
FOUNDATION_EXPORT const unsigned char EchatModelVersionString[];
#import <EchatModel/NSObject+EchatModel.h>
#import <EchatModel/EchatClassInfo.h>
#else
#import "NSObject+EchatModel.h"
#import "EchatClassInfo.h"
#endif
