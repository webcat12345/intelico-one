export enum ReportType {
  TotalActivity = 111,
  TotalActivityByIdentifier = 112,
  TotalActivityByIdentifierType = 112,
  TotalActivityByYear = 113,
  TotalActivityByMonth = 114,
  TotalActivityByDay = 115,
  TotalActivityByHours = 116,
  TotalActivityMinutes = 117,
  TotalActivityGrouped = 112,
  TotalActivityBySource = 112,
  TotalActivityByMetadata = 110,
  TotalActivityOData = 111,
  TotalActivityGroupedOData = 112,
  TotalActivityByYearOData = 113,
  TotalActivityByMonthOData = 114,
  TotalActivityByDayOData = 115,
  TotalActivityByHoursOData = 116,
  TotalActivityByMinutesOData = 117,
  //  TotalEventsEnterExit  = 108,
  TotalAlertsByIdentifier = 226,
  TotalAlertsByName = 226,
  TotalAlertsByActionReason = 226,
  TotalAlertsByStatus = 226,
  TotalAlertsByPriority = 226,
  TotalAlertsByYear = 227,
  TotalAlertsByMonth = 228,
  TotalAlertsByDay = 229,
  TotalAlertsByHours = 230,
  TotalAlertsByMinutes = 231,
  TotalOpenAlertsByYear = 227,
  TotalOpenAlertsByMonth = 228,
  TotalOpenAlertsByDay = 229,
  TotalOpenAlertsByHours = 230,
  TotalOpenAlertsByMinutes = 231,
  LongestOpenAlerts = 215,
  ResolvedAlertsDuration = 216,
  TotalAlertsResolved = 226,
  TotalOpenAlerts = 226,
  TotalAlertsByIdentifierType = 226,
  TotalUnresolvedAlerts = 218,
  TotalResolvedAlertsByYear = 227,
  TotalResolvedAlertsByMonth = 228,
  TotalResolvedAlertsByDay = 229,
  TotalResolvedAlertsByHours = 230,
  TotalResolvedAlertsByMinutes = 231,
  TotalAlertsOData = 225,
  TotalAlertsGroupedOData = 226,
  TotalAlertsByYearOData = 227,
  TotalAlertsByMonthOData = 228,
  TotalAlertsByDayOData = 229,
  TotalAlertsByHoursOData = 230,
  TotalAlertsByMinutesOData = 231,

}

export interface TotalAlertByPriority {
  normal: number;
  high: number;
  critical: number;
}
