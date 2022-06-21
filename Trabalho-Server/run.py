import uvicorn


def main():

    uvicorn.run("src.app:app", host="localhost", port=4560, reload=True, workers=1)


if __name__ == "__main__":
    main()
