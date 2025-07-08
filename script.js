
$(document).ready(async function () {
  let getLocalStorage = localStorage.getItem("data-list");
  if (getLocalStorage) {
    const data = JSON.parse(getLocalStorage);
    const { description } = await getMessageAPIDesc();
    const desc = description.replace(/\\n/g, "\n");
    const match = description.match(/https:\/\/udu-invitations\.com\/[^\s"]+\?to=[\w%-]*/);
    const urlLink = match ? match[0] : null;


    data.map((item, index) => {
      const firstKey = Object.keys(item)[0];
      const firstValue = item[firstKey];
      const replaceName = encodeURIComponent(firstValue);
      const messsage = generateMessage(replaceName, firstValue, desc);

      let $parent = $("<div>").addClass("mb-4");

      let $parentName = $("<div id='parent-name'>").addClass("flex gap-2 mb-2 items-center");
      let $name = $("<span>").addClass(`font-semibold text-[10px] ${item.isClick ? "text-green-600" : "text-gray-700"}`).text(`Link ${firstValue}`);

      let $parentLink = $("<div>").addClass("flex justify-between items-center");
      let $link = $("<a class='truncate'>").addClass("text-blue-600 w-[75%]").text(urlLink + replaceName);

      let $parentIcon = $("<div>").addClass("flex gap-2 w-[12%] justify-between items-center");
      let $iconShare = $("<div>")
        .addClass("cursor-pointer")
        .attr("title", "Share")
        .attr("data-message", messsage)
        .attr("data-index", index)
        .html('<i class="fa-solid fa-share"></i>')
        .on("click", function () {
          const message = $(this).attr("data-message");
          const idx = parseInt($(this).attr("data-index"), 10);
          shareLink(this, message, idx);
        });

      let $iconCopy = $(`<div class="cursor-pointer" title="Copy" onclick="copyLink(this, ${index})"><i class="fa-solid fa-clipboard"></i></div>`);


      $parentName.append($name);
      if (item.isClick) {
        $parentName.append(`<i class="fa-solid fa-circle-check text-green-600 fa-2xs"></i>`).append($(`<span class="text-green-600 text-[10px] done">Done!</span>`))
      }

      $parentLink.append($link);
      $parentIcon.append($iconShare).append($iconCopy);
      $parentLink.append($parentIcon);


      $parent.append($parentName);
      $parent.append($parentLink);
      $(".animation-loading").addClass("hidden");
      $("#output").append($parent);
    })
  } else {
    $(".animation-loading").addClass("hidden");
    $("#output").append(`<p class="text-center text-gray-600">Tidak ada data</p>`);
  }

  $("#upload-form").on("submit", function (evt) {
    evt.preventDefault();
    let fileInput = $("#upload")[0];
    let files = fileInput.files;

    if (files.length === 0) {
      alert("No file selected.");
      return;
    }

    $(".animation-loading").removeClass("hidden");
    $("#output").find("p").addClass("hidden");
    $("#output").find(".animation-loading").siblings().remove();
    $(this).find("button").prop("disabled", true).text("Loading...");

    setTimeout(() => {
      let xl2json = new ExcelToJSON();
      xl2json.parseExcel(files[0]);

      $(this).find("button").prop("disabled", false).text("Upload");
    }, 1000);
    localStorage.removeItem("data-list");
  });
});

$(".info-icon").on("click", function (e) {
  const tooltip = $(this).siblings(".tooltip");
  if (tooltip.hasClass("opacity-100")) {
    tooltip.removeClass("opacity-100 scale-100 pointer-events-auto")
      .addClass("opacity-0 scale-95 pointer-events-none");
  } else {
    tooltip.removeClass("opacity-0 scale-95 pointer-events-none")
      .addClass("opacity-100 scale-100 pointer-events-auto");
  }

  e.stopPropagation();
});

$(document).on("click", function () {
  $(".tooltip").removeClass("opacity-100 scale-100 pointer-events-auto")
    .addClass("opacity-0 scale-95 pointer-events-none");
});


class ExcelToJSON {
  constructor() {
    this.parseExcel = async function (file) {
      let reader = new FileReader();
      const { description } = await getMessageAPIDesc();
      const desc = description.replace(/\\n/g, "\n");
      const match = description.match(/https:\/\/udu-invitations\.com\/[^\s"]+\?to=[\w%-]*/);
      const urlLink = match ? match[0] : null;
      reader.onload = function (e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {
          type: "binary",
        });

        workbook.SheetNames.forEach(function (sheetName) {
          // Parse Excel sheet data
          let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          let json_object = JSON.stringify(XL_row_object);
          let data = JSON.parse(json_object);
          localStorage.setItem("data-list", json_object);
          // Append data rows
          data.forEach(function (item, index) {
            const firstKey = Object.keys(item)[0];
            const firstValue = item[firstKey];
            const replaceName = encodeURIComponent(firstValue);
            const messsage = generateMessage(replaceName, firstValue, desc);

            let $parent = $("<div>").addClass("mb-4");

            let $parentName = $("<div id='parent-name'>").addClass("flex gap-2 mb-2 items-center");
            let $name = $("<span>").addClass("font-semibold text-gray-700 text-[10px]").text(`Link ${firstValue}`);

            let $parentLink = $("<div>").addClass("flex justify-between items-center");
            let $link = $("<a class='truncate'>").addClass("text-blue-600 w-[75%]").text(urlLink + replaceName);

            let $parentIcon = $("<div>").addClass("flex gap-2 w-[12%] justify-between items-center");
            let $iconShare = $("<div>")
              .addClass("cursor-pointer")
              .attr("title", "Share")
              .attr("data-message", messsage)
              .attr("data-index", index)
              .html('<i class="fa-solid fa-share"></i>')
              .on("click", function () {
                const message = $(this).attr("data-message");
                const idx = parseInt($(this).attr("data-index"), 10);
                shareLink(this, message, idx);
              });
            let $iconCopy = $(`<div class="cursor-pointer" title="Copy" onclick="copyLink(this, ${index})"><i class="fa-solid fa-clipboard"></i></div>`);

            $parentName.append($name);
            $parentLink.append($link);
            $parentIcon.append($iconShare).append($iconCopy);
            $parentLink.append($parentIcon);

            $parent.append($parentName);
            $parent.append($parentLink);
            $(".animation-loading").addClass("hidden");
            $("#output").find("p").remove();
            $("#output").append($parent);
          });
        });
      };

      reader.onerror = function (ex) {
        console.log(ex);
      };

      reader.readAsArrayBuffer(file);
    };
  }
}

const shareLink = (element, message, index) => {
  let $parentName = $(element).parent().parent().siblings();
  let $iconSuccess = $(`<i class="fa-solid fa-circle-check text-green-600 fa-2xs"></i>`);

  $parentName.find("i").remove();
  $parentName.find("span").filter(".done").remove();
  $parentName.find("span").addClass("text-green-600");
  $parentName.append($iconSuccess).append($(`<span class="text-green-600 text-[10px] done">Done!</span>`));

  const getLocalStorage = localStorage.getItem("data-list");
  const updatedData = JSON.parse(getLocalStorage);
  updatedData.forEach((item, i) => {
    if (i === index) {
      item.isClick = true;
    } else {
      if (!("isClick" in item)) {
        item.isClick = false;
      }
    }
  });

  localStorage.setItem("data-list", JSON.stringify(updatedData));

  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};

const copyLink = (element, index) => {
  let $parentName = $(element).parent().parent().siblings();
  let $iconSuccess = $(`<i class="fa-solid fa-circle-check text-green-600 fa-2xs"></i>`);

  $parentName.find("i").remove();
  $parentName.find("span").filter(".done").remove();
  $parentName.find("span").addClass("text-green-600");
  $parentName.append($iconSuccess).append($(`<span class="text-green-600 text-[10px] done">Done!</span>`));

  $(element).html(`<i class="fa-solid fa-check text-green-600"></i>`);

  const link = $(element).parent().parent().find("a").text();
  navigator.clipboard.writeText(link);

  const getLocalStorage = localStorage.getItem("data-list");
  const updatedData = JSON.parse(getLocalStorage);
  updatedData.forEach((item, i) => {
    if (i === index) {
      item.isClick = true;
    } else {
      if (!("isClick" in item)) {
        item.isClick = false;
      }
    }
  });

  localStorage.setItem("data-list", JSON.stringify(updatedData));

  setTimeout(() => {
    $(element).html(`<i class="fa-solid fa-clipboard"></i>`);
  }, 1000);
}

const generateMessage = (name, firstValue, msgAPI) => {

  msgAPI = msgAPI.replace(/\$\{parameter\}/g, firstValue);
  msgAPI = msgAPI.replace(/\$\{parameter-2\}/g, name);

  return msgAPI;
};


const getMessageAPIDesc = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bride = urlParams.get("bride");

  try {
    const response = await fetch("https://api-udu-invitations.vercel.app/api/v1/udu-invitations/message-form" + `?bride=${bride}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
