import conn from "../database/database.js";

type Paginate = {
  pageNumber: number;
  model: any;
  contentPerPage: number;
  projection?: any;
  query?: any;
  keyname?: string;
};

const paginate = async ({
  pageNumber = 1,
  model,
  contentPerPage = 9,
  projection,
  query = {},
  keyname,
}: Paginate) => {
  try {
    const CONTENT_PER_PAGE: number = contentPerPage;
    const LIMIT: number = CONTENT_PER_PAGE;
  
    pageNumber = Number(pageNumber)

    const numOfDocs: number = await conn.model(model).countDocuments();
    const numOfPages: number = Math.ceil(
      (await conn.model(model).countDocuments()) / CONTENT_PER_PAGE
    );
    const Collection = conn.model(model);
    let docs: any = Collection.find(query)
      .skip((pageNumber - 1) * CONTENT_PER_PAGE)
      .limit(LIMIT)
      .lean();

    if (projection) {
      docs.select(projection);
    }

    docs = await docs;
    //lowercase the model's name and use as it as a key in the returned object, like "Post => posts"
    const key = `${String(model).toLowerCase()}s`;
    return {
      [keyname || key]: docs,
      numOfPages,
      hasNext: pageNumber * CONTENT_PER_PAGE < numOfDocs,
      hasPrev: pageNumber > 1,
      count: docs.length
    };
  } catch (error) {
    throw error;
  }
};

export default paginate;
