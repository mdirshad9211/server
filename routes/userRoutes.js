const { Router } = require("express")
const{registerUser, loginUser, getUser, getAuthors, editUser, changeAvatar} = require("../controllers/userControllers");



const router = Router() 

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-avatar', changeAvatar)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.patch('/edit-user', editUser)

module.exports = router