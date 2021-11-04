const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/bd_livros", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

module.exports = mongoose;