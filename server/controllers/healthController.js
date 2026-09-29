/**
 * API Health Check Controller
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PeshAssist API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
}
