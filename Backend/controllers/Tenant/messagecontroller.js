const createTenantDb = require("../../utills/createTenantDb");


const sendMessage = async (req, res) => {
    try {
        const { companyName, id } = req.user;
        const { receiverId, projectId, message } = req.body;

        const { Message } = await createTenantDb(companyName);

        const newMessage = await Message.create({ senderId: id, receiverId, projectId, message })

        req.io.to(receiverId.toString()).emit("receive_message", newMessage);


        res.status(201).json({ message: 'message sent succesfuly' })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getMessage = async (req, res) => {
    try {
        const { companyName, id } = req.user;
        const { userId, projectId } = req.body

        const { Message } = await createTenantDb(companyName)
        const messages = await Message.findAll({
            where: {
                // projectId,
                // contractId,
                // senderId: [id, userId],
                receiverId: id,
            },
            order: [["createdAt", "ASC"]],
        });
        res.status(201).json({success: true, data: messages})
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
module.exports = {
    sendMessage,
    getMessage
}

