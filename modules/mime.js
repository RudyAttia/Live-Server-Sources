function mimeext(ext){
    switch(ext){
        case "png":
            return "image/png"
        case "jpg":
        case "jpeg":
            return "image/jpeg"
        case "gif":
            return "image/gif"
        case "ico":
            return "image/x-icon"
        case "svg":
            return "image/svg+xml"
        case "tif":
        case "tiff":
            return "image/tiff"
        case "webp":
            return "image/webp"

        
        case "aac":
            return "audio/aac"
        case "mp3":
            return "audio/mpeg3"
        case "mid":
        case "midi":
            return "audio/midi"
        case "oga":
            return "audio/ogg"
        case "wav":
            return "audio/x-wav"
        case "weba":
            return "audio/webm"


        case "avi":
            return "video/x-msvideo"
        case "mp4":
            return "video/mp4"
        case "mkv":
            return "video/x-matroska"
        case "mpeg":
            return "video/mpeg"
        case "ogv":
            return "video/ogg"
        case "webm":
            return "video/webm"
        case "3gp":
            return "video/3gpp"
        case "3g2":
            return "video/3gpp2"


        case "zip":
            return "application/zip"
        case "7z":
            return "application/x-7z-compressed"
        case "abw":
            return "application/x-abiword"
        case "arc":
            return "application/octet-stream"
        case "azw":
            return "application/vnd.amazon.ebook"
        case "bin":
            return "application/octet-stream"
        case "bz":
            return "application/x-bzip"
        case "bz2":
            return "application/x-bzip2"
        case "csh":
            return "application/x-csh"
        case "doc":
            return "application/msword"
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        case "eot":
            return "application/vnd.ms-fontobject"
        case "epub":
            return "application/epub+zip"
        case "jar":
            return "application/java-archive"
        case "mpkg":
            return "application/vnd.apple.installer+xml"
        case "odp":
            return "application/vnd.oasis.opendocument.presentation"
        case "ods":
            return "application/vnd.oasis.opendocument.spreadsheet"
        case "odt":
            return "application/vnd.oasis.opendocument.text"
        case "ogx":
            return "application/ogg"
        case "pdf":
            return "application/pdf"
        case "ppt":
            return "application/vnd.ms-powerpoint"
        case "pptx":
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        case "rar":
            return "application/x-rar-compressed"
        case "rtf":
            return "application/rtf"
        case "sh":
            return "application/x-sh"
        case "swf":
            return "application/x-shockwave-flash"
        case "tar":
            return "application/x-tar"
        case "vsd":
            return "application/vnd.visio"
        case "xls":
            return "application/vnd.ms-excel"
        case "xlsx":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        case "xul":
            return "application/vnd.mozilla.xul+xml"
        case "exe":
            return "application/octet-stream"
        case "otf":
            return "font/otf"
        case "ttf":
            return "font/ttf"
        case "woff":
            return "font/woff"
        case "woff2":
            return "font/woff2"


        default:
            return "text/plain"
    }
}
module.exports = mimeext;