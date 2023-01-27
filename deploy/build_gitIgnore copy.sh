# # 設定取得決定位置
# SOURCE="${BASH_SOURCE[0]}"
# while [ -h "$SOURCE" ]; do
#     DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"
#     SOURCE="$(readlink "$SOURCE")"
#     [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
# done
# export ABS_DIR="$( cd -P "$( dirname "$SOURCE" )/../" >/dev/null && pwd )"

PUBLIC_GIT_IGNORE_PATH="$ABS_DIR/public/.gitignore"

echo "STEP 3-1: 執行移除 public 下的 gitignore 程序"
rm $PUBLIC_GIT_IGNORE_PATH
echo "STEP 3-1: 執行移除 public 下的 gitignore 程序 完成"
