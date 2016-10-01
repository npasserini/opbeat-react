var passThrough = function () {
  return function (next) {
    return function (action) {
      return next(action)
    }
  }
}

function createOpbeatMiddleware (serviceContainer) {
  if (serviceContainer === false || window.__opbeat === false) {
    return passThrough
  }

  if (!serviceContainer) {
    serviceContainer = window.__opbeat
  }

  var transactionService = serviceContainer.services.transactionService
  return function () {
    return function (next) {
      return function (action) {
        var tr, ret

        serviceContainer.services.zoneService.zone.run(function () {
          var currTrans
          currTrans = transactionService.getCurrentTransaction()
          if (action.type && action.type.indexOf('@@') !== 0) { // doesn't start with
            if (currTrans && currTrans.name !== 'ZoneTransaction') {
              if (action.type) {
                tr = transactionService.startTrace('dispatch ' + action.type, 'spa.dispatch')
              } else {
                tr = transactionService.startTrace('dispatch', 'app.dispatch')
              }
            } else {
              if (action.type) {
                currTrans = transactionService.startTransaction(action.type, 'spa.action')
              }
            }
          }

          ret = next(action)

          if (currTrans) {
            currTrans.detectFinish()
          }
        })

        if (tr) {
          tr.end()
        }

        return ret
      }
    }
  }
}

module.exports = {
  createOpbeatMiddleware: createOpbeatMiddleware
}
