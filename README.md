  
![enter image description here](https://img.shields.io/github/package-json/v/EmilTheSadCat/rename-cli-tool)
# rename-them-all


CLI tool written in node.js for renaming multiple files at once.
 It can:
 - rename files using template
 - add suffixes and prefixes
 -  add dimensions in file name for images
 - add size range as suffix or prefix
 -  rename files with a specific extension
 - rename files by groups like images,  docs, audio, video 

This is a tool I wrote for myself, but I wanted to share it. So here it is.
I use it for archiving my files or managing image files.

## Install

```

npm install -g rename-them-all

```
Install **rename-them-all** globally, then you can call it from any directory in your console.

## Usage
Caution! The outcome of executing this program is irreversible!


##### Renaming files

```
// let's say we have such files in our directory:
// bull.txt, cat.txt, dog.jpeg, mouse.pdf


$ rename-them-all "example_[###]"

// output: example_001.txt, example_002.txt, example_003.jpeg, example_004.pdf
```

[###] - index template is mandatory in your new file name
```
index template options:

[#] --> 1
[##] --> 01
[###] --> 001
```

  ---

##### Adding prefix or suffix
To add a prefix or suffix set **-p**,  **-s** or both.  
This method doesn't work with **renaming files**.



```
// files in our directory:
// bull.txt, cat.txt, dog.jpeg, mouse.pdf



$ rename-them-all -p=examplePrefix_        <--- Prefix

// output: examplePrefix_bull.txt, examplePrefix_cat.txt ...



$ rename-them-all -s=_exampleSuffix       <--- Suffix

// output: bull_exampleSuffix.txt, cat_exampleSuffix.txt ...



$ rename-them-all -p=examplePrefix_ -s=_exampleSuffix       <--- Both

// output: examplePrefix_bull_exampleSuffix.txt, examplePrefix_cat_exampleSuffix.txt ...
```
---
##### Choose extension type
To choose extension type for files set **-t** flag

```
// files in our directory: 
// bull.txt, cat.txt, dog.jpeg, mouse.pdf 


$ rename-them-all "example_[###]" -t=jpeg       <--- Renaming files

// output: bull.txt, cat.txt, example_001.jpeg, mouse.pdf


$ rename-them-all -p=example_ -t=jpeg       <--- Prefix / Suffix

// output: bull.txt, cat.txt, example_dog.jpeg, mouse.pdf

```
---
##### Choose type group
To choose a type group set **-g** flag.
Possible options: `images | docs | audio | video`
```
// files in our directory: 
// bull.txt, cat.txt, dog.jpeg, mouse.pdf 


$ rename-them-all "example_[###]" -g=docs

// output: example_001.txt, example_002.txt, dog.jpeg, example_003.pdf
```

Type groups:
```
images: ['jpeg', 'jpg', 'png', 'bmp', 'tiff', 'gif'],
docs: ['txt', 'doc', 'docs', 'pdf', 'epub', 'mobi'],
audio: ['mp3', 'wav', 'mpeg4', 'flac', 'ogg'],
video: ['avi', 'mp4', 'mkv']
```
> Note: there will be more
  ---
##### Adding image dimensions
You can add image dimensions to your file name using image size template.
Works with **renaming files** only.
You have to set **-g** flag to `images`.

```
// files in our directory: 
// bull.txt, cat.txt, dog.jpeg, mouse.pdf 


$ rename-them-all "example_[##]_[wh]" -g=images

// output: bull.txt, cat.txt, example_01_200x300.jpeg, example_003.pdf
```

 You can print dimensions differently:  
 `[wh]` is a image size template
 `w` stands for width
 `h` stands form height

```
[w] renders only width
[h] renders only height
[wh] renders width then height
[hw] renders height then width
```
> Note: For this moment you can use only one image size template in a file name
---
##### Adding image size range name

You can add suffix or prefix with a size range name for images. 
Set **-i** flag. You can use it only with **-s** or **-p** flag. Also setting **-g** to `images` is mandatory.

```
// files in our directory: 
// bull.txt, cat.txt, dog.jpeg, mouse.pdf 
// let's say that dog.jpeg dimensions are 200x200

$ rename-them-all -s -i -g=images       <--- Suffix

// Output: bull.txt, cat.txt, dog_small.jpeg ...

$ rename-them-all -p -i -g=images		<--- Prefix

// Output: bull.txt, cat.txt, small_dog.jpeg ...
```

Here are the available ranges based on image resolution:
```
small: 1px - 122500px,
medium: 122501px - 840000px,
large: 840001px - Infinity
```
## Links

  

- NPM: https://www.npmjs.com/package/rename-them-all

- Repository: https://github.com/EmilTheSadCat/rename-them-all

  
  

## Licensing

  

The code in this project is licensed under ISC license.