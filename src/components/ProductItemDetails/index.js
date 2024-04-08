// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import {IoMdStar} from 'react-icons/io'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import './index.css'
import Header from '../Header'

const api = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {similarProd: [], count: 1, ProductDetails: [], apistat: api.initial}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apistat: api.loading,
    })
    const {match} = this.props

    const {params} = match
    const {id} = params
    console.log(id)
    const jwt = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const responseData = await response.json()
    if (response.ok) {
      console.log(responseData)
      const updatedData = {
        id: responseData.id,
        imageUrl: responseData.image_url,
        title: responseData.title,
        price: responseData.price,
        description: responseData.description,
        availability: responseData.availability,
        brand: responseData.brand,
        rating: responseData.rating,
        similarProducts: responseData.similar_products,
        totalReviews: responseData.total_reviews,
      }
      console.log(updatedData.similarProducts[0])

      this.setState({
        ProductDetails: updatedData,
        apistat: api.success,
        similarProd: updatedData.similarProducts,
      })
    } else {
      this.setState({
        apistat: api.failure,
      })
    }
  }

  incrementCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  decrementCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  loadingView = () => (
    <div className="loadingCont" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failureViewCont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="errorImage"
      />
      <h1 className="productnotfound">Product Not Found</h1>
      <button
        onClick={this.onclickContinue}
        type="button"
        className="btnContinueShoping"
      >
        Continue Shopping
      </button>
    </div>
  )

  onclickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  successView = () => {
    const {similarProd, count, ProductDetails} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      availability,
      brand,
      rating,
      similarProducts,
      totalReviews,
    } = ProductDetails

    return (
      <div>
        <div className="poductdetailsContainer">
          <div className="imageContainer">
            <img src={imageUrl} alt="product" className="mainProductImage" />
          </div>
          <div className="detailCont">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="ratingandReviewCont">
              <div className="ratingCont">
                <p className="rating">{rating}</p>
                <IoMdStar className="starIcon" />
              </div>

              <p className="reviewsPara">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availabilityCount">
              <span className="availabilityHead">Availability: </span>
              {availability}
            </p>
            <p className="availabilityCount">
              <span className="availabilityHead"> Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="incAndDecContainer">
              <BsDashSquare
                onClick={this.decrementCount}
                type="button"
                className="buttonMinusAndPlus"
              />

              <p className="count">{count}</p>
              <BsPlusSquare
                onClick={this.incrementCount}
                type="button"
                className="buttonMinusAndPlus"
              />
            </div>
            <button type="button" className="adddToCart">
              Add to Cart
            </button>
          </div>
        </div>
        <h1 className="headSimilarProducts">Similar Products</h1>
        <ul className="similarProdContainer">
          {similarProd.map(each => (
            <li key={each.id} className="listTag">
              <img
                src={each.image_url}
                alt={`similar product ${each.title}`}
                className="imageSimilar"
              />
              <h1 className="titleSimilar">{each.title}</h1>
              <p className="brandSimilar">By {each.brand}</p>
              <div className="similarRatingAndPriceContainer">
                <p className="price">Rs {each.price}/- </p>
                <div className="ratingCont">
                  <p className="rating">{each.rating}</p>
                  <IoMdStar className="starIconSimilar" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  checkstate = () => {
    const {apistat} = this.state
    switch (apistat) {
      case api.failure:
        return this.failureView()
      case api.success:
        return this.successView()
      case api.loading:
        return this.loadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.checkstate()}
      </div>
    )
  }
}

export default ProductItemDetails
