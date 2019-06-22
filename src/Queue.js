class Queue {

    Queue() {
        this.queue = [];
    }

    push(callback) {
        this.queue.push(() => {
            this.handleQueue();
        });
    }


}

module.exports = new Queue();