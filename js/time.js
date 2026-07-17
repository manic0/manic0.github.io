document.addEventListener("DOMContentLoaded", function () {

    // 网站建立时间
    const grt = new Date("2024-07-23T16:37:00");

    function createtime() {

        const time = document.getElementById("time");

        // time 元素还没插入，直接退出
        if (!time) {
            return;
        }

        const now = new Date();

        const diff = now - grt;

        const dnum = Math.floor(diff / (1000 * 60 * 60 * 24));

        const hnum = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const mnum = Math.floor(
            (diff % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const snum = Math.floor(
            (diff % (1000 * 60)) /
            1000
        );

        time.innerHTML =
            "本站已安全运行 " +
            dnum +
            " 天 " +
            String(hnum).padStart(2, "0") +
            " 小时 " +
            String(mnum).padStart(2, "0") +
            " 分 " +
            String(snum).padStart(2, "0") +
            " 秒";
    }

    // 先执行一次
    createtime();

    // 每秒刷新一次
    setInterval(createtime, 1000);

});