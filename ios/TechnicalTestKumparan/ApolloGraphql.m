//
//  ApolloGraphql.m
//  TechnicalTestKumparan
//
//  Created by user on 17/07/21.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ApolloGraphql, NSObject)

RCT_EXTERN_METHOD(initiateClient:(NSString *)url)
RCT_EXTERN_METHOD(query:(NSInteger *)pageSize cursor:(NSString *)cursor successCallback:(RCTResponseSenderBlock)successCallback failureCallback:(RCTResponseSenderBlock)failureCallback)
@end
