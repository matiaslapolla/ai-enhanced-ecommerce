"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Eye, CheckCircle, XCircle } from "lucide-react"

interface FraudAlert {
  id: string
  type: "suspicious_transaction" | "unusual_behavior" | "high_risk_user" | "payment_anomaly"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  timestamp: Date
  userId?: string
  transactionId?: string
  riskScore: number
  status: "active" | "investigating" | "resolved" | "false_positive"
}

export function FraudDetectionSystem() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedToday: 0,
    averageRiskScore: 0,
  })

  useEffect(() => {
    // Mock fraud alerts data
    const mockAlerts: FraudAlert[] = [
      {
        id: "1",
        type: "suspicious_transaction",
        severity: "high",
        description: "Multiple high-value purchases from new account within 1 hour",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        userId: "user_12345",
        transactionId: "txn_67890",
        riskScore: 85,
        status: "active",
      },
      {
        id: "2",
        type: "unusual_behavior",
        severity: "medium",
        description: "User accessing from multiple countries in short timeframe",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        userId: "user_54321",
        riskScore: 65,
        status: "investigating",
      },
      {
        id: "3",
        type: "payment_anomaly",
        severity: "critical",
        description: "Failed payment attempts with multiple different cards",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        userId: "user_98765",
        transactionId: "txn_11111",
        riskScore: 95,
        status: "active",
      },
      {
        id: "4",
        type: "high_risk_user",
        severity: "low",
        description: "User profile matches known fraud patterns",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        userId: "user_44444",
        riskScore: 45,
        status: "resolved",
      },
    ]

    setAlerts(mockAlerts)

    // Calculate stats
    const activeAlerts = mockAlerts.filter((a) => a.status === "active").length
    const resolvedToday = mockAlerts.filter(
      (a) => a.status === "resolved" && a.timestamp.toDateString() === new Date().toDateString(),
    ).length
    const avgRisk = mockAlerts.reduce((sum, alert) => sum + alert.riskScore, 0) / mockAlerts.length

    setStats({
      totalAlerts: mockAlerts.length,
      activeAlerts,
      resolvedToday,
      averageRiskScore: Math.round(avgRisk),
    })
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "investigating":
        return <Eye className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "false_positive":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const handleAlertAction = (alertId: string, action: "investigate" | "resolve" | "false_positive") => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: action === "investigate" ? "investigating" : action } : alert,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">{stats.totalAlerts}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-bold">{stats.averageRiskScore}%</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Fraud Detection Alerts
          </CardTitle>
          <CardDescription>Monitor and manage suspicious activities and potential fraud attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-l-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(alert.status)}
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                      <Badge variant="outline">Risk: {alert.riskScore}%</Badge>
                      <span className="text-sm text-gray-500">{alert.timestamp.toLocaleString()}</span>
                    </div>
                    <AlertDescription className="mb-2">
                      <strong>{alert.type.replace("_", " ").toUpperCase()}:</strong> {alert.description}
                    </AlertDescription>
                    {alert.userId && (
                      <p className="text-sm text-gray-600">
                        User ID: {alert.userId}
                        {alert.transactionId && ` | Transaction: ${alert.transactionId}`}
                      </p>
                    )}
                  </div>

                  {alert.status === "active" && (
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleAlertAction(alert.id, "investigate")}>
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAlertAction(alert.id, "resolve")}>
                        Resolve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleAlertAction(alert.id, "false_positive")}>
                        False Positive
                      </Button>
                    </div>
                  )}
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
