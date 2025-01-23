
$(document).ready(function () {
  $("#upload-form").on("submit", function (evt) {
    evt.preventDefault();

    let fileInput = $("#upload")[0];
    let files = fileInput.files;

    if (files.length === 0) {
      alert("No file selected.");
      return;
    }

    let xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
  });
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

          // Append data rows
          data.forEach(function (item) {
            let $parent = $("<div>").addClass("mb-4");

            let $parentName = $("<div id='parent-name'>").addClass("flex gap-2 mb-2 items-center");
            let $name = $("<span>").addClass("font-semibold text-gray-700 text-[10px]").text(`Link ${item.name}`);

            let $parentLink = $("<div>").addClass("flex justify-between items-center");
            let $link = $("<a>").addClass("text-blue-600 w-[80%]").text("https://juandisyahputro.github.io/portfolio-tailwind-css/");

            let $parentIcon = $("<div>").addClass("flex gap-2 w-[20%] justify-between items-center");
            let $iconShare = $(`<div class="cursor-pointer" title="Share" onclick="shareLink(this)"><i class="fa-solid fa-share"></i></div>`);
            let $iconCopy = $(`<div class="cursor-pointer" title="Copy" onclick="copyLink(this)"><i class="fa-solid fa-clipboard"></i></div>`);

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

const shareLink = (element) => {
  let $parentName = $(element).parent().parent().siblings();
  let $iconSuccess = $(`<i class="fa-solid fa-circle-check text-green-600 fa-2xs"></i>`);

  $parentName.find("i").remove();
  $parentName.find("span").addClass("text-green-600");
  $parentName.append($iconSuccess);

  const message = "Check this out! https://juandisyahputro.github.io/portfolio-tailwind-css/";
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};

const copyLink = (element) => {
  let $parentName = $(element).parent().parent().siblings();
  let $iconSuccess = $(`<i class="fa-solid fa-circle-check text-green-600 fa-2xs"></i>`);

  $parentName.find("i").remove();
  $parentName.find("span").addClass("text-green-600");
  $parentName.append($iconSuccess);

  $(element).html(`<i class="fa-solid fa-check text-green-600"></i>`);

  const link = $(element).parent().parent().find("a").text();
  navigator.clipboard.writeText(link);
}