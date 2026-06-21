/**
 * 汇总所有路由
 */
import homeRoutes from './modules/home'
import investRoutes from './modules/invest'
import toolsRoutes from './modules/tools'
import userRoutes from './modules/user'
import userRequirementRoutes from './modules/userRequirement'
import settingsRoutes from './modules/settings'
import testRoutes from './modules/test'
import errorRoutes from './modules/error'
import aiResumeRoutes from './modules/aiResume'
import resumeEditorRoutes from './modules/resumeEditor'

export const routes = [
  ...homeRoutes,
  ...investRoutes,
  ...toolsRoutes,
  ...userRoutes,
  ...userRequirementRoutes,
  ...settingsRoutes,
  ...testRoutes,
  ...errorRoutes,
  ...aiResumeRoutes,
  ...resumeEditorRoutes,
]
