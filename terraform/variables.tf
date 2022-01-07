variable "mapbox_token" {
  description = "MAPBOX_TOKEN"
  type = string
}

variable "account_id" {
  description = "Account ID"
  type = string
}
variable "my_region" {
  description = "Region"
  type = string
}
variable "cloudwatch_logs_retention_policy" {
  description = "Logs retention policy in days"
  type = number
  default = 30
}
