
$(document).ready(function () {
  let getLocalStorage = localStorage.getItem("data-list");
  if (getLocalStorage) {
    const data = JSON.parse(getLocalStorage);

    data.map((item, index) => {
      const firstKey = Object.keys(item)[0];
      const firstValue = item[firstKey];
      const replaceName = firstValue.replace(/ /g, '%20');
      const messsage = generateMessage(replaceName, firstValue);

      let $parent = $("<div>").addClass("mb-4");

      let $parentName = $("<div id='parent-name'>").addClass("flex gap-2 mb-2 items-center");
      let $name = $("<span>").addClass(`font-semibold text-[10px] ${item.isClick ? "text-green-600" : "text-gray-700"}`).text(`Link ${firstValue}`);

      let $parentLink = $("<div>").addClass("flex justify-between items-center");
      let $link = $("<a class='truncate'>").addClass("text-blue-600 w-[75%]").text("https://udu-invitations.com/wedding-verdy-natali/?to=" + replaceName);

      let $parentIcon = $("<div>").addClass("flex gap-2 w-[12%] justify-between items-center");
      let $iconShare = $(`<div class="cursor-pointer" title="Share" onclick='shareLink(this, ${messsage}, ${index})'><i class="fa-solid fa-share"></i></div>`);
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
      $("#output").append($parent);
    })
  }

  $("#upload-form").on("submit", function (evt) {
    evt.preventDefault();
    let fileInput = $("#upload")[0];
    let files = fileInput.files;

    if (files.length === 0) {
      alert("No file selected.");
      return;
    }

    $("#output").empty();
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
    this.parseExcel = function (file) {
      let reader = new FileReader();

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
            const messsage = generateMessage(replaceName, firstValue);

            let $parent = $("<div>").addClass("mb-4");

            let $parentName = $("<div id='parent-name'>").addClass("flex gap-2 mb-2 items-center");
            let $name = $("<span>").addClass("font-semibold text-gray-700 text-[10px]").text(`Link ${firstValue}`);

            let $parentLink = $("<div>").addClass("flex justify-between items-center");
            let $link = $("<a class='truncate'>").addClass("text-blue-600 w-[75%]").text("https://udu-invitations.com/wedding-verdy-natali/?to=" + replaceName);

            let $parentIcon = $("<div>").addClass("flex gap-2 w-[12%] justify-between items-center");
            let $iconShare = $(`<div class="cursor-pointer" title="Share" onclick='shareLink(this, ${messsage}, ${index})'><i class="fa-solid fa-share"></i></div>`);
            let $iconCopy = $(`<div class="cursor-pointer" title="Copy" onclick="copyLink(this, ${index})"><i class="fa-solid fa-clipboard"></i></div>`);

            $parentName.append($name);
            $parentLink.append($link);
            $parentIcon.append($iconShare).append($iconCopy);
            $parentLink.append($parentIcon);

            $parent.append($parentName);
            $parent.append($parentLink);
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

const generateMessage = (name, firstValue) => {
  const msg = `Yth. *${firstValue}*,\n\n_*Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.* —— *Matius 19:6*_\n\nDengan segenap rasa syukur atas karunia yang telah Tuhan berikan, kami bermaksud untuk mengundang dalam acara pernikahan kami,\n\n*Noverdi Setyo Pambudi dengan Gloria Natali Br. Panggabean*\n\nInformasi lebih lengkap mengenai detail acara, bisa klik link tautan di bawah ini:\nhttps://udu-invitations.com/wedding-verdy-natali/?to=${name}\n\nSuatu kebahagiaan untuk kami jika para saudara/i berkenan hadir di acara kami. Atas kehadirannya kami ucapkan banyak terima kasih.\n\nMohon maaf perihal undangan hanya dibagikan melalui pesan ini.`

  return JSON.stringify(msg);
};