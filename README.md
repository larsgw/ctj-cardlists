# ctj-cardlists

Repository for topics with ctj-cardlists. This repository contains topics submitted by users. 
To submit a topic, see below. To open a topic, open **any** topic (like [this one](https://larsgw.github.io/ctj-cardlists/cardlist?t=co1)), go to the sidebar and click a link under "Other datasets".

## Submitting a topic

To submit a topic, follow a few steps.

1. Copy the repository locally
2. Install the following pieces of software:
  1. [getpapers](https://github.com/ContentMine/getpapers)
  2. [norma](https://github.com/ContentMine/norma)
  3. [ami](https://github.com/ContentMine/ami)
  4. [nodejs](https://nodejs.org) and the packages: [commander](https://www.npmjs.com/package/commander), [fs](https://nodejs.org/api/fs.html), [xmldoc](https://www.npmjs.com/package/xmldoc), [progress](https://www.npmjs.com/package/progress) and [colors](https://www.npmjs.com/package/colors)
3. Run [data/cmine.sh](https://github.com/larsgw/ctj-cardlists/blob/master/data/cmine.sh) with the following arguments:
  * `-q`: Query. [Query documentation](https://github.com/ContentMine/workshop-resources/blob/master/software-tutorials/getpapers/getpapers-eupmc-queries.md)
  * `-l`: Number of articles. Something around 250-1000
  * `-p`: Project code. Three-symbol non-taken code. To see taken codes, see [data/topics.json](https://github.com/larsgw/ctj-cardlists/blob/master/data/topics.json)
  * `-c`: Columns. Comma seperated list. Possibilities: a (articles), c (genus), b (binomial)
4. Now the data is present but unlisted. To list it, add an entry to [data/topics.json](https://github.com/larsgw/ctj-cardlists/blob/master/data/topics.json) as in the examples
5. Create a pull request
6. When accepted, the link to your dataset is `https://larsgw.github.io/ctj-cardlists/cardlist?t=YOUR_CODE`. When your project code is `co1` for example, your link is https://larsgw.github.io/ctj-cardlists/cardlist?t=co1

## License

For the license of the different articles mentioned in the content, see the respective articles. The underlying source code in this repository used to format and display that content is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).
