


function previewThumbnail() {
    var imagePreview = document.getElementById('ThumbnailPreview');
    var file = document.getElementById('thumbnail').files[0];

    // Xóa toàn bộ nội dung cũ trước khi hiển thị lại ảnh
    imagePreview.innerHTML = "";


    if (file.type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Tạo một thẻ div chứa cả ảnh và nút xóa
            var imgWrapper = document.createElement('div');
            imgWrapper.style.position = 'relative';
            imgWrapper.style.display = 'inline-block';
            imgWrapper.style.marginRight = '10px';

            // Tạo thẻ img để hiển thị ảnh
            var img = document.createElement('img');

            img.src = e.target.result;
            img.style.width = '150px';  // Kích thước ảnh
            img.style.height = '150px';  // Kích thước ảnh
            img.style.objectFit = 'cover'; // Đảm bảo ảnh giữ tỉ lệ khi bị crop
            img.style.border = '1px solid #ccc';
            img.style.padding = '5px';
            imgWrapper.appendChild(img);

            // Tạo nút "X" để xóa ảnh
            var closeButton = document.createElement('span');
            closeButton.innerHTML = '&times;';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '0';
            closeButton.style.left = '0';
            closeButton.style.background = 'red';
            closeButton.style.color = 'white';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '20px';
            closeButton.style.padding = '5px';



            imgWrapper.appendChild(closeButton);

            // Thêm div chứa ảnh và nút xóa vào imagePreview
            imagePreview.appendChild(imgWrapper);

            // Khi nhấn vào nút "X", ảnh sẽ bị xóa
            closeButton.onclick = function() {
                document.getElementById('thumbnail').value = "";
                previewThumbnail();
            };
        }

        reader.readAsDataURL(file);
    }
}
let selectedFiles = [];

function previewImages() {
    var imagePreview = document.getElementById('imagePreview');
    var files = document.getElementById('images').files;

    // Thêm các file mới vào mảng `selectedFiles`
    for (let i = 0; i < files.length; i++) {
        selectedFiles.push(files[i]);
    }

    // Xóa toàn bộ nội dung cũ trước khi hiển thị lại ảnh
    imagePreview.innerHTML = "";

    // Lặp qua tất cả các file đã chọn để hiển thị

    selectedFiles.forEach(function(file, index) {
        if (file.type.match('image.*')) {
            var reader = new FileReader();

            reader.onload = function(e) {
                // Tạo một thẻ div chứa cả ảnh và nút xóa
                var imgWrapper = document.createElement('div');
                imgWrapper.style.position = 'relative';
                imgWrapper.style.display = 'inline-block';
                imgWrapper.style.marginRight = '10px';

                // Tạo thẻ img để hiển thị ảnh
                var img = document.createElement('img');

                img.src = e.target.result;
                img.style.width = '150px';  // Kích thước ảnh
                img.style.height = '150px';  // Kích thước ảnh
                img.style.objectFit = 'cover'; // Đảm bảo ảnh giữ tỉ lệ khi bị crop
                img.style.border = '1px solid #ccc';
                img.style.padding = '5px';
                imgWrapper.appendChild(img);

                // Tạo nút "X" để xóa ảnh
                var closeButton = document.createElement('span');
                closeButton.innerHTML = '&times;';
                closeButton.style.position = 'absolute';
                closeButton.style.top = '0';
                closeButton.style.left = '0';
                closeButton.style.background = 'red';
                closeButton.style.color = 'white';
                closeButton.style.cursor = 'pointer';
                closeButton.style.fontSize = '20px';
                closeButton.style.padding = '5px';



                imgWrapper.appendChild(closeButton);

                // Thêm div chứa ảnh và nút xóa vào imagePreview
                imagePreview.appendChild(imgWrapper);

                // Khi nhấn vào nút "X", ảnh sẽ bị xóa
                closeButton.onclick = function() {
                    document.getElementById('images').value = "";
                    removeImage(index); // Gọi hàm xóa ảnh
                    console.log(selectedFiles);
                };
            }

            reader.readAsDataURL(file);
        }
    });
}


// Hàm xóa ảnh khỏi mảng `selectedFiles` và cập nhật lại giao diện
function removeImage(index) {
    selectedFiles.splice(index, 1); // Xóa ảnh khỏi mảng dựa trên vị trí index

    previewImages(); // Hiển thị lại các ảnh còn lại
}
