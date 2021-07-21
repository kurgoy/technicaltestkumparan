//
//  ApolloGraphql.swift
//  TechnicalTestKumparan
//
//  Created by user on 17/07/21.
//
import Apollo

@objc (ApolloGraphql)
class ApolloGraphql : NSObject {
  
  var apollo: ApolloClient?
  
  @objc
  func initiateClient(_ url: String) {
    apollo = ApolloClient(url: URL(string: url)!)
  }
  
  // Calling a routine & get response back
  @objc
  func query(_ pageSize: Int,cursor: String, patchSize: String, successCallback: @escaping RCTResponseSenderBlock,failureCallback: @escaping RCTResponseSenderBlock) {
    apollo?.fetch(query: LaunchListQuery(pageSize: pageSize, cursor: cursor, patchSize: PatchSize(rawValue: patchSize))) { result in
      switch result {
      case .success(let graphQLResult):
        var launches = [Dictionary<String, Any>]()
        for item in graphQLResult.data?.launches.launches ?? [] {

          let rocket: Dictionary<String, Any> = [
            "name": item?.rocket?.name,
            "type": item?.rocket?.type
          ]
          let mission: Dictionary<String, Any> = [
            "name": item?.mission?.name,
            "missionPatch": item?.mission?.missionPatch
          ]

          let launch: Dictionary<String, Any> = [
            "id": item?.id,
            "site": item?.site,
            "rocket": rocket,
            "mission": mission
          ]

          launches.append(launch)
        }

        let dictionary: Dictionary<String, Any> = [
          "cursor" : graphQLResult.data?.launches.cursor,
          "hasMore" : graphQLResult.data?.launches.hasMore,
          "launches": launches
        ]

        successCallback([dictionary])
      case .failure(let error):
        print("Failure! Error: \(error)")
        failureCallback([error])
      }
    }
  }
}
