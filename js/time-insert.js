document.addEventListener("DOMContentLoaded", function () {

    // 查找统计信息区域
    const statistics = document.querySelector(".statistics");

    if (!statistics) {
        console.warn("未找到 .statistics 元素");
        return;
    }

    // 防止重复插入
    if (document.getElementById("time")) {
        return;
    }

    // 创建运行时间容器
    const newDiv = document.createElement("div");
    newDiv.style.marginTop = "8px";
    newDiv.innerHTML = '<span id="time"></span>';

    // 插入到统计信息后面
    statistics.after(newDiv);

});